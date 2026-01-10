import IssueMiniCard from "./IssueMiniCard";
import "../../../styles/recentIssues.css";

const RecentIssues = ({ issues }) => {
  const safeIssues = Array.isArray(issues) ? issues : [];

  return (
    <section className="recent-issues">
      <h3>Recently Updated</h3>

      {safeIssues.length === 0 ? (
        <p className="empty-state">No recent activity</p>
      ) : (
        <div className="issues-grid">
          {safeIssues.map((issue) => (
            <IssueMiniCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentIssues;
