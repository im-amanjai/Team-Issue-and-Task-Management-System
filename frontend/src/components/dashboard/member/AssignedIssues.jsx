import IssueMiniCard from "../common/IssueMiniCard";
import "../../../styles/recentIssues.css";

const AssignedIssues = ({ issues }) => {
  const safeIssues = Array.isArray(issues) ? issues : [];

  return (
    <section className="recent-issues">
      <h3>Assigned to Me</h3>

      {safeIssues.length === 0 ? (
        <p className="empty-state">No issues assigned</p>
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

export default AssignedIssues;
