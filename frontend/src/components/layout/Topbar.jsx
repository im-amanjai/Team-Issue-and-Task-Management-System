import { Search, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import {
  getMyNotifications,
  markNotificationRead,
} from "../../api/notificationApi";

import CreateIssueModal from "../issues/CreateIssueModal";

const Topbar = ({ onSearch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getMyNotifications(token).then((res) => setNotifications(res.data));
    }
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notification) => {
    await markNotificationRead(notification._id, token);

    navigate(`/${user.role}/issues/${notification.issue._id}`);

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notification._id ? { ...n, isRead: true } : n
      )
    );

    setOpen(false);
  };

  // Page title based on route
  const getPageTitle = () => {
    if (location.pathname.includes("/issues")) return "Issues";
    if (location.pathname.includes("/board")) return "Board";
    return "Dashboard";
  };

  return (
    <>
      <header className="topbar">
        <h1 className="topbar-title">{getPageTitle()}</h1>

        <div className="topbar-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              placeholder="Search issues..."
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>

          {/* + New Issue (Admin & Manager only) */}
          {user?.role !== "member" && (
            <button
              className="new-issue-btn"
              onClick={() => setShowCreate(true)}
            >
              + New Issue
            </button>
          )}

          {/* Notifications */}
          <div className="notification-wrapper">
            <button
              className="icon-btn"
              onClick={() => setOpen((prev) => !prev)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {open && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <p className="empty">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`notification-item ${
                        !n.isRead ? "unread" : ""
                      }`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <strong>{n.issue.issueKey}</strong>
                      <p>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Create Issue Modal */}
      {showCreate && (
        <CreateIssueModal
          role={user.role}
          onClose={() => setShowCreate(false)}
        />
      )}
    </>
  );
};

export default Topbar;
