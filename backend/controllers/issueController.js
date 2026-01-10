const Issue = require("../models/Issue");
const Notification = require("../models/Notification");

/**
 * CREATE ISSUE
 * Admin / Manager (Member optional later)
 */
exports.createIssue = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not allowed to create issue" });
    }

    const issue = await Issue.create({
      ...req.body,
      status: "todo",
      reporter: req.user.id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ISSUES (role-based visibility)
 * - Admin: all issues
 * - Manager: all issues (project-scoped later)
 * - Member: only assigned issues
 */
exports.getIssues = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "member") {
      query.assignee = req.user.id;
    }

    const issues = await Issue.find(query)
      .populate("reporter", "name role")
      .populate("assignee", "name role")
      .sort({ updatedAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ASSIGN ISSUE (Manager / Admin)
 * Sets status → in_progress
 * Sends notification
 */
exports.assignIssue = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not allowed to assign issues" });
    }

    const { userId } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.assignee = userId;
    issue.status = "in_progress";
    await issue.save();

    await Notification.create({
      userId,
      issueId: issue._id,
      message: "You have been assigned a new issue",
    });

    res.json({
      message: "Issue assigned successfully",
      issue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ISSUE STATUS (role-based workflow)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // MEMBER RULES
    if (req.user.role === "member") {
      if (String(issue.assignee) !== req.user.id) {
        return res.status(403).json({ message: "Not your assigned issue" });
      }

      const allowed = {
        todo: ["in_progress"],
        in_progress: ["done"],
      };

      if (!allowed[issue.status]?.includes(status)) {
        return res
          .status(403)
          .json({ message: "Invalid status transition" });
      }
    }

    // MANAGER RULES
    if (req.user.role === "manager") {
      if (!["todo", "in_progress", "done", "closed"].includes(status)) {
        return res
          .status(403)
          .json({ message: "Invalid status for manager" });
      }
    }

    // ADMIN → full access
    issue.status = status;
    await issue.save();

    res.json({
      message: "Issue status updated successfully",
      issue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE ISSUE (Admin only)
 */
exports.deleteIssue = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await issue.deleteOne();
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
