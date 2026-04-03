import { ClipboardList, LayoutDashboard, PlusCircle, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BottomNav = () => {
  const { user } = useAuth();
  const basePath = `/${user.role}`;

  return (
    <nav className="bottom-nav">
      <NavLink to={basePath} end className="bottom-nav-item">
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to={`${basePath}/issues`} className="bottom-nav-item">
        <ClipboardList size={18} />
        <span>Issues</span>
      </NavLink>

      {user.role === "manager" ? (
        <NavLink to={`${basePath}/issues/new`} className="bottom-nav-item">
          <PlusCircle size={18} />
          <span>Create</span>
        </NavLink>
      ) : user.role === "admin" ? (
        <NavLink to="/admin/users" className="bottom-nav-item">
          <Users size={18} />
          <span>Users</span>
        </NavLink>
      ) : (
        <NavLink to={basePath} className="bottom-nav-item">
          <LayoutDashboard size={18} />
          <span>Home</span>
        </NavLink>
      )}

      {user.role === "manager" ? (
        <NavLink to={basePath} className="bottom-nav-item">
          <LayoutDashboard size={18} />
          <span>Home</span>
        </NavLink>
      ) : (
        <NavLink to={`${basePath}/issues`} className="bottom-nav-item">
          <ClipboardList size={18} />
          <span>Work</span>
        </NavLink>
      )}
    </nav>
  );
};

export default BottomNav;
