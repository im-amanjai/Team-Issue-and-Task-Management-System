import { useEffect, useState } from "react";
import DashboardOverview from "../../components/dashboard/DashboardOverview";
import { getIssues } from "../../api/issueApi";
import { getDashboardData } from "../../api/dashboardApi";

const MemberDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getIssues().then(setIssues).catch(() => setIssues([]));
    getDashboardData("member").then(setSummary).catch(() => setSummary(null));
  }, []);

  return (
    <DashboardOverview
      title="Member overview"
      subtitle="Stay focused on your assigned work and the latest updates."
      issues={issues}
      extraCards={[
        { label: "Assigned to me", value: summary?.myIssuesCount ?? 0 },
      ]}
    />
  );
};

export default MemberDashboard;
