import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyNotifications, markNotificationRead } from "../../api/notificationApi";
import { useTheme } from "../../context/ThemeContext";

const titleMap = {
  issues: "Issue Workspace",
  users: "User Management",
  new: "Create Issue",
  profile: "Profile",
};

const Topbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, [location.pathname]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const currentTitle = useMemo(() => {
    const lastSegment = location.pathname.split("/").filter(Boolean).at(-1);
    return titleMap[lastSegment] || "Dashboard";
  }, [location.pathname]);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((items) =>
        items.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch {
      return;
    }
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Team Issue & Task Management System</p>
        <h1 className="page-title">{currentTitle}</h1>
      </div>

      <div className="topbar-actions">
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="icon-button" onClick={() => setOpen((value) => !value)}>
          <Bell size={18} />
          {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
        </button>

        {open && (
          <div className="notification-panel">
            <div className="notification-panel-header">
              <span>Notifications</span>
              <button className="link-button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="empty-state">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item._id}
                  to={`/${location.pathname.split("/")[1]}/issues/${item.issue?._id}`}
                  className={`notification-item ${item.isRead ? "" : "notification-item-unread"}`}
                  onClick={() => handleRead(item._id)}
                >
                  <strong>{item.issue?.issueKey || "Issue"}</strong>
                  <span>{item.message}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
