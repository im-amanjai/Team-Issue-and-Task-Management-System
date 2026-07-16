const Attachment = require("../models/Attachment");
const Issue = require("../models/Issue");
const { cloudinary } = require("../config/cloudinary");

exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const attachment = await Attachment.create({
      issueId: issue._id,
      userId: req.user.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: req.file.path,
    });

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttachmentsByIssue = async (req, res) => {
  try {
    const attachments = await Attachment.find({ issueId: req.params.issueId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    if (attachment.filename) {
      try {
        await cloudinary.uploader.destroy(attachment.filename);
      } catch (_) {}
    }

    await attachment.deleteOne();
    res.json({ message: "Attachment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
