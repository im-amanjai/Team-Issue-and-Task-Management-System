import { NavLink, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, PlusCircle, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const basePath = `/${user.role}`;

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-mark">IT</div>
          <div>
            <p className="brand-title">IssueTrack Pro</p>
            <p className="brand-subtitle">Team task workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to={basePath} end className="nav-item">
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to={`${basePath}/issues`} className="nav-item">
            <ClipboardList size={18} />
            Issues
          </NavLink>
          {user.role === "manager" && (
            <NavLink to={`${basePath}/issues/new`} className="nav-item">
              <PlusCircle size={18} />
              Create Issue
            </NavLink>
          )}
          {user.role === "admin" && (
            <NavLink to="/admin/users" className="nav-item">
              <Users size={18} />
              Manage Users
            </NavLink>
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div>
          <p className="user-chip-name">{user.name}</p>
          <p className="user-chip-role">{user.role}</p>
        </div>
        <button
          className="secondary-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
