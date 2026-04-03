import { useEffect, useState } from "react";
import DashboardOverview from "../../components/dashboard/DashboardOverview";
import { getIssues } from "../../api/issueApi";
import { getDashboardData } from "../../api/dashboardApi";

const ManagerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getIssues().then(setIssues).catch(() => setIssues([]));
    getDashboardData("manager").then(setSummary).catch(() => setSummary(null));
  }, []);

  return (
    <DashboardOverview
      title="Manager overview"
      subtitle="Track assignments, issue load, and progress across your team."
      issues={issues}
      extraCards={[
        { label: "Assigned issues", value: summary?.totalAssignedIssues ?? 0 },
      ]}
    />
  );
};

export default ManagerDashboard;
