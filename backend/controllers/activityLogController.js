const ActivityLog = require("../models/ActivityLog");

exports.getLogsByIssue = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ issueId: req.params.issueId })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLog = async ({ issueId, userId, action, field, oldValue, newValue }) => {
  try {
    await ActivityLog.create({ issueId, userId, action, field, oldValue, newValue });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};
