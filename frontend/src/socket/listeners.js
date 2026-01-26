export const registerSocketListeners = ({
  socket,
  onIssueCreated,
  onIssueAssigned,
  onIssueUpdated,
  onIssueDeleted,
}) => {
  socket.on("issue:created", onIssueCreated);
  socket.on("issue:assigned", onIssueAssigned);
  socket.on("issue:updated", onIssueUpdated);
  socket.on("issue:deleted", onIssueDeleted);
};

export const unregisterSocketListeners = (socket) => {
  socket.off("issue:created");
  socket.off("issue:assigned");
  socket.off("issue:updated");
  socket.off("issue:deleted");
};
