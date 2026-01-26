import StatsGrid from "../../components/dashboard/common/StatsGrid";
import IssuesStatusChart from "../../components/dashboard/charts/IssuesStatusChart";
import MonthlyIssuesChart from "../../components/dashboard/charts/MonthlyIssuesChart";
import RecentIssues from "../../components/dashboard/common/RecentIssues";
import "../../styles/dashboard.css";

const ManagerDashboard = ({ issues }) => {
  return (
    <div className="dashboard-container">
      <StatsGrid issues={issues} />

      <div className="dashboard-charts">
        <IssuesStatusChart issues={issues} />
        <MonthlyIssuesChart issues={issues} />
      </div>

      <RecentIssues issues={issues} />
    </div>
  );
};

export default ManagerDashboard;
