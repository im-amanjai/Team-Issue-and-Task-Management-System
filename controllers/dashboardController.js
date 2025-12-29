const User = require("../models/User");
const Issue = require("../models/Issue");

/**
 * admin dashboard
 */
exports.adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalIssues = await Issue.countDocuments();

    const issuesByStatus = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const issuesByPriority = await Issue.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalIssues,
      issuesByStatus,
      issuesByPriority
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * manager dashnboard
 */
exports.managerDashboard = async (req, res) => {
  try {
    const totalAssignedIssues = await Issue.countDocuments({
      assignedTo: { $ne: null }
    });

    const pendingIssues = await Issue.countDocuments({
      status: { $in: ["Open", "In Progress"] }
    });

    const resolvedIssues = await Issue.countDocuments({
      status: "Resolved"
    });

    const memberWiseIssues = await Issue.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "member"
        }
      },
      { $unwind: "$member" },
      {
        $project: {
          _id: 0,
          memberId: "$member._id",
          name: "$member.name",
          count: 1
        }
      }
    ]);

    res.json({
      totalAssignedIssues,
      pendingIssues,
      resolvedIssues,
      memberWiseIssues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * member dashboard
 */
exports.memberDashboard = async (req, res) => {
  try {
    const myIssuesCount = await Issue.countDocuments({
      assignedTo: req.user.userId
    });

    const recentIssues = await Issue.find({
      assignedTo: req.user.userId
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title status priority updatedAt");

    res.json({
      myIssuesCount,
      recentIssues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
