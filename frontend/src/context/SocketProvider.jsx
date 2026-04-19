import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket/socket";
import {
  registerSocketListeners,
  unregisterSocketListeners,
} from "../socket/listeners";

const SocketContext = createContext(null);

export const SocketProvider = ({ user, issueActions, children }) => {
  useEffect(() => {
    if (!user || !user._id) {
      if (socket.connected) socket.disconnect();
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", {
      userId: user._id,
      role: user.role,
    });

    registerSocketListeners({
      socket,
      onIssueCreated: issueActions.addIssue,
      onIssueAssigned: issueActions.addOrUpdateIssue,
      onIssueUpdated: issueActions.updateIssue,
      onIssueDeleted: issueActions.removeIssue,
    });

    return () => {
      unregisterSocketListeners(socket);
    };
  }, [issueActions.addIssue, issueActions.addOrUpdateIssue, issueActions.removeIssue, issueActions.updateIssue, user, user._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);
