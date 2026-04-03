const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    issueKey: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["bug", "feature", "task"],
      default: "task",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate ISSUE KEY
issueSchema.pre("save", async function () {
  if (this.issueKey) return;

  const count = await mongoose.model("Issue").countDocuments();
  this.issueKey = `ISS-${String(count + 1).padStart(3, "0")}`;
});

module.exports = mongoose.model("Issue", issueSchema);
