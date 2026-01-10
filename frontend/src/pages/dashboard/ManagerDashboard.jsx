import StatsGrid from "../../components/dashboard/common/StatsGrid";
import IssuesStatusChart from "../../components/dashboard/charts/IssuesStatusChart";
import MonthlyIssuesChart from "../../components/dashboard/charts/MonthlyIssuesChart";
import RecentIssues from "../../components/dashboard/common/RecentIssues";
import "../../styles/dashboard.css";

const ManagerDashboard = () => {
  return (
    <div className="dashboard-container">
      <StatsGrid />

      <div className="dashboard-charts">
        <IssuesStatusChart />
        <MonthlyIssuesChart />
      </div>

      {/* NO Team Members for Manager */}

      <RecentIssues />
    </div>
  );
};

export default ManagerDashboard;
