const Issue = require("../models/Issue");
const Notification = require("../models/Notification");

/**
 * create issue (Admin / Manager / Member)
 * Status defaults to "Open"
 */
exports.createIssue = async (req, res) => {
  try {
    const issue = await Issue.create({
      ...req.body,
      status: "Open",
      createdBy: req.user.userId
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * get issues (Role-based visibility)
 * - Admin / Manager: all issues
 * - Member: only assigned issues
 */
exports.getIssues = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "member") {
      query.assignedTo = req.user.userId;
    }

    const issues = await Issue.find(query)
      .populate("createdBy", "name role")
      .populate("assignedTo", "name role")
      .sort({ updatedAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * assign issue (Manager only)
 * Automatically sets status → In Progress
 * Triggers notification to assigned user
 */
exports.assignIssue = async (req, res) => {
  try {
    const { userId } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue)
      return res.status(404).json({ message: "Issue not found" });

    issue.assignedTo = userId;
    issue.status = "In Progress";
    await issue.save();

    // Notification to assigned user
    await Notification.create({
      userId,
      issueId: issue._id,
      message: "You have been assigned a new issue"
    });

    res.json({
      message: "Issue assigned successfully",
      issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * update issue status (Role-based rules)
 * - Member: only assigned issue, only In Progress / Resolved
 * - Manager: In Progress / Resolved / Closed
 * - Admin: any status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue)
      return res.status(404).json({ message: "Issue not found" });

    //member rules
    if (req.user.role === "member") {
      if (!issue.assignedTo || String(issue.assignedTo) !== req.user.userId) {
        return res.status(403).json({ message: "Not your assigned issue" });
      }

      if (!["In Progress", "Resolved"].includes(status)) {
        return res
          .status(403)
          .json({ message: "Members cannot set this status" });
      }
    }

    //manager rules
    if (req.user.role === "manager") {
      if (!["In Progress", "Resolved", "Closed"].includes(status)) {
        return res
          .status(403)
          .json({ message: "Invalid status for manager" });
      }
    }

    // admin rules → full access
    issue.status = status;
    await issue.save();

    res.json({
      message: "Issue status updated successfully",
      issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * delete issue (Admin only)
 */
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue)
      return res.status(404).json({ message: "Issue not found" });

    await issue.deleteOne();

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
