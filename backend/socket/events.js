const { getIO } = require("./index");

const emitIssueCreated = (issue) => {
  const io = getIO();
  io.to("admin").emit("issue:created", issue);
  io.to("manager").emit("issue:created", issue);
};

const emitIssueAssigned = (issue, userId) => {
  const io = getIO();
  io.to(userId.toString()).emit("issue:assigned", issue);
};

const emitIssueUpdated = (issue) => {
  const io = getIO();
  io.to("admin").emit("issue:updated", issue);
  io.to("manager").emit("issue:updated", issue);

  if (issue.assignee) {
    io.to(issue.assignee.toString()).emit("issue:updated", issue);
  }
};

const emitIssueDeleted = (issue) => {
  const io = getIO();
  io.to("admin").emit("issue:deleted", issue._id);
  io.to("manager").emit("issue:deleted", issue._id);

  if (issue.assignee) {
    io.to(issue.assignee.toString()).emit("issue:deleted", issue._id);
  }
};

module.exports = {
  emitIssueCreated,
  emitIssueAssigned,
  emitIssueUpdated,
  emitIssueDeleted,
};
