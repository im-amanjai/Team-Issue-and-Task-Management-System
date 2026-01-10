const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Issue = require("../models/Issue");

/**
 * create comment (All authenticated users)
 * - Supports threaded comments
 * - Triggers notifications
 */
exports.addComment = async (req, res) => {
  try {
    const { issueId, text, parentCommentId } = req.body;

    // Check issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Create comment
    const comment = await Comment.create({
      issueId,
      text,
      parentCommentId: parentCommentId || null,
      userId: req.user.userId
    });

    /* NOTIFICATIONS */

    // Notify assigned user (if exists & not self)
    if (
      issue.assignedTo &&
      String(issue.assignedTo) !== req.user.userId
    ) {
      await Notification.create({
        userId: issue.assignedTo,
        issueId,
        message: "New comment added on an issue assigned to you"
      });
    }

    // notify issue creator (if not self)
    if (String(issue.createdBy) !== req.user.userId) {
      await Notification.create({
        userId: issue.createdBy,
        issueId,
        message: "New comment added on your issue"
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * get comments for an issue(Threaded)
 * - Sorted by creation time
 * - includes author name androle
 */
exports.getCommentsByIssue = async (req, res) => {
  try {
    const comments = await Comment.find({
      issueId: req.params.issueId
    })
      .populate("userId", "name role")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * delete comment (Admin only)
 */
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
