import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bug,
  KanbanSquare,
  Users,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import "../../styles/layout.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // clear localStorage + context
    navigate("/login"); // redirect to login
  };

  // Decide dashboard route by role
  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "manager"
      ? "/manager"
      : "/member";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🐞</div>
        <span>IssueTrack</span>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        <NavLink to={dashboardPath} end className="sidebar-link">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to={`${dashboardPath}/issues`}
          className="sidebar-link"
        >
          <Bug size={18} />
          Issues
        </NavLink>

        <NavLink
          to={`${dashboardPath}/board`}
          className="sidebar-link"
        >
          <KanbanSquare size={18} />
          Board
        </NavLink>

        {/* Admin-only */}
        {user?.role === "admin" && (
          <NavLink to="/admin/users" className="sidebar-link">
            <Users size={18} />
            Users
          </NavLink>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
