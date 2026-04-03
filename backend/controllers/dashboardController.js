const User = require("../models/User");
const Issue = require("../models/Issue");

exports.adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalIssues = await Issue.countDocuments();

    const issuesByStatus = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const issuesByPriority = await Issue.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    res.json({
      totalUsers,
      totalIssues,
      issuesByStatus,
      issuesByPriority,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.managerDashboard = async (req, res) => {
  try {
    const totalAssignedIssues = await Issue.countDocuments({
      assignee: { $ne: null },
    });

    const pendingIssues = await Issue.countDocuments({
      status: { $in: ["open", "in_progress"] },
    });

    const completedIssues = await Issue.countDocuments({
      status: "completed",
    });

    const memberWiseIssues = await Issue.aggregate([
      { $match: { assignee: { $ne: null } } },
      { $group: { _id: "$assignee", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },
      {
        $project: {
          _id: 0,
          memberId: "$member._id",
          name: "$member.name",
          count: 1,
        },
      },
    ]);

    res.json({
      totalAssignedIssues,
      pendingIssues,
      completedIssues,
      memberWiseIssues,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.memberDashboard = async (req, res) => {
  try {
    const myIssuesCount = await Issue.countDocuments({
      assignee: req.user.userId,
    });

    const recentIssues = await Issue.find({
      assignee: req.user.userId,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("issueKey title status priority updatedAt");

    res.json({
      myIssuesCount,
      recentIssues,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
