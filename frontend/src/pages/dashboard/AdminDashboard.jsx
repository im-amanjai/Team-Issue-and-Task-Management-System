import StatsGrid from "../../components/dashboard/common/StatsGrid";
import IssuesStatusChart from "../../components/dashboard/charts/IssuesStatusChart";
import MonthlyIssuesChart from "../../components/dashboard/charts/MonthlyIssuesChart";
import TeamMembers from "../../components/dashboard/admin/TeamMembers";
import RecentIssues from "../../components/dashboard/common/RecentIssues";
import "../../styles/dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Top Stats */}
      <StatsGrid />

      {/* Charts Section */}
      <div className="dashboard-charts">
        <IssuesStatusChart />
        <MonthlyIssuesChart />
      </div>

      {/* Team Members (Admin only) */}
      <TeamMembers />

      {/* Recently Updated */}
      <RecentIssues />
    </div>
  );
};

export default AdminDashboard;
