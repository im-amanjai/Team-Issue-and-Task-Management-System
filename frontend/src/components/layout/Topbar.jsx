import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyNotifications,
  markNotificationRead,
} from "../../api/notificationApi";

import "../../styles/layout.css";

const Topbar = ({ onSearch }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getMyNotifications(token).then((res) => setNotifications(res.data));
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClick = async (notification) => {
    await markNotificationRead(notification._id, token);
    navigate(`/member/issues/${notification.issue._id}`);
    setOpen(false);
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title">Dashboard</h1>

      <div className="topbar-actions">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search issues..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <div className="notification-wrapper">
          <button className="icon-btn" onClick={() => setOpen(!open)}>
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
                    onClick={() => handleClick(n)}
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
  );
};

export default Topbar;
