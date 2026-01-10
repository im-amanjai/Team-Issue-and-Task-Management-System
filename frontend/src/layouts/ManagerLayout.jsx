import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="admin-content">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
