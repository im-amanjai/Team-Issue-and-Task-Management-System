const mongoose = require("mongoose");
const Issue = require("../models/Issue");
const User = require("../models/User");
const Notification = require("../models/Notification");

const {
  emitIssueCreated,
  emitIssueAssigned,
  emitIssueUpdated,
  emitIssueDeleted,
} = require("../socket/events");

/**
 * CREATE ISSUE
 */
exports.createIssue = async (req, res) => {
  try {
    const { assignee, ...rest } = req.body;
    const { role, userId } = req.user;

    if (role === "member") {
      return res.status(403).json({ message: "Members cannot create issues" });
    }

    const issue = await Issue.create({
      ...rest,
      reporter: new mongoose.Types.ObjectId(userId),
      assignee: assignee ? new mongoose.Types.ObjectId(assignee) : null,
      status: assignee ? "in_progress" : "todo",
    });

    if (assignee) {
      await Notification.create({
        user: assignee,
        issue: issue._id,
        message: "You have been assigned a new issue",
      });
    }

    emitIssueCreated(issue);
    if (assignee) emitIssueAssigned(issue, assignee);

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET MY ISSUES 
 */
exports.getIssues = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);
    let query = {};

    if (req.user.role === "member") {
      // Member sees only assigned issues
      query.assignee = userObjectId;
    }

    // Managers/Admins see all issues

    const issues = await Issue.find(query)
      .populate("reporter", "name role")
      .populate("assignee", "name role")
      .sort({ updatedAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ASSIGN ISSUE
 */
exports.assignIssue = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const { role } = req.user;

    if (!["admin", "manager"].includes(role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const assignee = await User.findById(assignedTo);
    if (!assignee) return res.status(400).json({ message: "Invalid assignee" });

    if (role === "admin" && assignee.role !== "manager")
      return res.status(403).json({ message: "Admin → Manager only" });

    if (role === "manager" && assignee.role !== "member")
      return res.status(403).json({ message: "Manager → Member only" });

    issue.assignee = new mongoose.Types.ObjectId(assignedTo);
    issue.status = "in_progress";
    await issue.save();

    await Notification.create({
      user: assignedTo,
      issue: issue._id,
      message: "You have been assigned a new issue",
    });

    emitIssueAssigned(issue, assignedTo);
    emitIssueUpdated(issue);

    res.json({ message: "Issue assigned", issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE STATUS
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (
      req.user.role === "member" &&
      String(issue.assignee) !== String(req.user.userId)
    ) {
      return res.status(403).json({ message: "Not your issue" });
    }

    issue.status = status;
    await issue.save();

    emitIssueUpdated(issue);

    res.json({ message: "Status updated", issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE ISSUE
 */
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    await issue.deleteOne();
    emitIssueDeleted(issue);

    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
