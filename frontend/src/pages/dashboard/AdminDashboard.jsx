import { useEffect, useState } from "react";
import DashboardOverview from "../../components/dashboard/DashboardOverview";
import { getIssues } from "../../api/issueApi";
import { getDashboardData } from "../../api/dashboardApi";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getIssues().then(setIssues).catch(() => setIssues([]));
    getDashboardData("admin").then(setSummary).catch(() => setSummary(null));
  }, []);

  return (
    <DashboardOverview
      title="Admin overview"
      subtitle="Monitor the whole team, review trends, and manage system access."
      issues={issues}
      extraCards={[{ label: "Total users", value: summary?.totalUsers ?? 0 }]}
    />
  );
};

export default AdminDashboard;
