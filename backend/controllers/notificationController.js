const Notification = require("../models/Notification");

/**
 * GET my notifications
 */
exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .populate("issue", "issueKey title")
    .sort({ createdAt: -1 });

  res.json(notifications);
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  if (String(notification.user) !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ message: "Marked as read" });
};
