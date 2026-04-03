const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Issue = require("../models/Issue");

exports.addComment = async (req, res) => {
  try {
    const { issueId, text, parentCommentId } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comment = await Comment.create({
      issueId,
      text: text.trim(),
      parentCommentId: parentCommentId || null,
      userId: req.user.userId,
    });

    if (issue.assignee && String(issue.assignee) !== String(req.user.userId)) {
      await Notification.create({
        user: issue.assignee,
        issue: issue._id,
        message: `New comment on ${issue.title}`,
      });
    }

    if (String(issue.reporter) !== String(req.user.userId)) {
      await Notification.create({
        user: issue.reporter,
        issue: issue._id,
        message: `New comment on ${issue.title}`,
      });
    }

    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "name role"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommentsByIssue = async (req, res) => {
  try {
    const comments = await Comment.find({ issueId: req.params.issueId })
      .populate("userId", "name role")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
