import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

const AppShell = () => {
  return (
    <div className="shell">
      <Sidebar />
      <div className="shell-main">
        <Topbar />
        <main className="page-wrap">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default AppShell;
