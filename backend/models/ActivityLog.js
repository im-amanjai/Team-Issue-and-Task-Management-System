const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "status_changed", "assigned", "commented", "attachment_added", "attachment_deleted"],
      required: true,
    },
    field: {
      type: String,
      default: null,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ issueId: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
