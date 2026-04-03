const mongoose = require("mongoose");
const Issue = require("../models/Issue");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");

const {
  emitIssueCreated,
  emitIssueAssigned,
  emitIssueUpdated,
  emitIssueDeleted,
} = require("../socket/events");

const issuePopulate = [
  { path: "reporter", select: "name email role" },
  { path: "assignee", select: "name email role" },
];

const canManageIssues = (role) => ["admin", "manager"].includes(role);

const canViewIssue = (issue, user) => {
  if (user.role !== "member") return true;

  return String(issue.assignee?._id || issue.assignee) === String(user.userId);
};

const buildIssueQuery = (req) => {
  const { status, priority, category, assignee, search } = req.query;
  const query = {};

  if (req.user.role === "member") {
    query.assignee = new mongoose.Types.ObjectId(req.user.userId);
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (assignee) query.assignee = assignee;

  if (search) {
    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { issueKey: { $regex: search, $options: "i" } },
        ],
      },
    ];
  }

  return query;
};

const loadIssue = async (id) => Issue.findById(id).populate(issuePopulate);

exports.createIssue = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Only managers can create issues" });
    }

    const { title, description, category, priority, assignee } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    let safeAssignee = null;

    if (assignee) {
      const assigneeUser = await User.findById(assignee);
      if (!assigneeUser || assigneeUser.role !== "member") {
        return res.status(400).json({ message: "Managers can assign issues only to members" });
      }

      safeAssignee = assigneeUser._id;
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      reporter: req.user.userId,
      assignee: safeAssignee,
      status: "open",
    });

    if (safeAssignee) {
      await Notification.create({
        user: safeAssignee,
        issue: issue._id,
        message: `You were assigned to ${issue.title}`,
      });
    }

    const populatedIssue = await loadIssue(issue._id);
    emitIssueCreated(populatedIssue);

    if (safeAssignee) {
      emitIssueAssigned(populatedIssue, safeAssignee);
    }

    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find(buildIssueQuery(req))
      .populate(issuePopulate)
      .sort({ updatedAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await loadIssue(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (!canViewIssue(issue, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (!canManageIssues(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    ["title", "description", "category", "priority"].forEach((field) => {
      if (req.body[field] !== undefined) {
        issue[field] = req.body[field];
      }
    });

    await issue.save();
    const populatedIssue = await loadIssue(issue._id);
    emitIssueUpdated(populatedIssue);

    res.json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignIssue = async (req, res) => {
  try {
    if (!canManageIssues(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const { assignee } = req.body;

    if (!assignee) {
      issue.assignee = null;
      issue.status = "open";
      await issue.save();

      const populatedIssue = await loadIssue(issue._id);
      emitIssueUpdated(populatedIssue);
      return res.json(populatedIssue);
    }

    const assigneeUser = await User.findById(assignee);
    if (!assigneeUser || assigneeUser.role !== "member") {
      return res.status(400).json({ message: "Invalid assignee" });
    }

    issue.assignee = assigneeUser._id;
    issue.status = "open";
    await issue.save();

    await Notification.create({
      user: assigneeUser._id,
      issue: issue._id,
      message: `You were assigned to ${issue.title}`,
    });

    const populatedIssue = await loadIssue(issue._id);
    emitIssueAssigned(populatedIssue, assigneeUser._id);
    emitIssueUpdated(populatedIssue);

    res.json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const { status } = req.body;
    const flow = {
      open: ["in_progress", "completed"],
      in_progress: ["completed"],
      completed: ["in_progress"],
    };

    if (!flow[issue.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${issue.status} to ${status}`,
      });
    }

    if (req.user.role !== "member") {
      return res.status(403).json({
        message: "Only the assigned member can update issue status",
      });
    }

    if (String(issue.assignee) !== String(req.user.userId)) {
      return res.status(403).json({
        message: "Only the assigned member can update this issue",
      });
    }

    issue.status = status;
    await issue.save();

    const populatedIssue = await loadIssue(issue._id);
    emitIssueUpdated(populatedIssue);

    res.json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await Comment.deleteMany({ issueId: issue._id });
    await Notification.deleteMany({ issue: issue._id });
    await issue.deleteOne();

    emitIssueDeleted(issue);
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
