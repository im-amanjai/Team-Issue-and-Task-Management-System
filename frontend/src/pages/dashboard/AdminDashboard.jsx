import StatsGrid from "../../components/dashboard/common/StatsGrid";
import IssuesStatusChart from "../../components/dashboard/charts/IssuesStatusChart";
import MonthlyIssuesChart from "../../components/dashboard/charts/MonthlyIssuesChart";
import TeamMembers from "../../components/dashboard/admin/TeamMembers";
import RecentIssues from "../../components/dashboard/common/RecentIssues";
import "../../styles/dashboard.css";

const AdminDashboard = ({ issues }) => {
  return (
    <div className="dashboard-container">
      <StatsGrid issues={issues} />

      <div className="dashboard-charts">
        <IssuesStatusChart issues={issues} />
        <MonthlyIssuesChart issues={issues} />
      </div>

      <TeamMembers />

      <RecentIssues issues={issues} />
    </div>
  );
};

export default AdminDashboard;
