import { useOutletContext } from "react-router-dom";

import StatsGrid from "../../components/dashboard/common/StatsGrid";
import RecentIssues from "../../components/dashboard/common/RecentIssues";
import AssignedIssues from "../../components/dashboard/member/AssignedIssues";

import "../../styles/dashboard.css";

const MemberDashboard = ({ issues }) => {
  const { searchQuery } = useOutletContext();
  const safeIssues = Array.isArray(issues) ? issues : [];

  const filteredIssues = safeIssues.filter((issue) => {
    const q = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(q) ||
      issue.issueKey.toLowerCase().includes(q)
    );
  });

  const recentIssues = filteredIssues.slice(0, 4);

  const hasSearch = searchQuery.trim().length > 0;
  const noResults = hasSearch && filteredIssues.length === 0;

  return (
    <div className="dashboard-container">
      <StatsGrid issues={filteredIssues} />

      {noResults ? (
        <div className="no-results">
          <h3>No results found</h3>
          <p>Try searching with a different keyword.</p>
        </div>
      ) : (
        <>
          <AssignedIssues issues={filteredIssues} />
          <RecentIssues issues={recentIssues} />
        </>
      )}
    </div>
  );
};

export default MemberDashboard;
