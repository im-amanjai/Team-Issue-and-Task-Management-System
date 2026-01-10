import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const MemberLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar onSearch={setSearchQuery} />

        <main className="admin-content">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
