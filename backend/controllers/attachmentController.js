const Attachment = require("../models/Attachment");
const Issue = require("../models/Issue");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Issue not found" });
    }

    const attachment = await Attachment.create({
      issueId: issue._id,
      userId: req.user.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/api/attachments/file/${req.file.filename}`,
    });

    res.status(201).json(attachment);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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

exports.downloadFile = async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const attachment = await Attachment.findOne({ filename: req.params.filename });
    if (attachment) {
      res.download(filePath, attachment.originalName);
    } else {
      res.download(filePath);
    }
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

    const filePath = path.join(uploadsDir, attachment.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await attachment.deleteOne();
    res.json({ message: "Attachment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
