import "../../../styles/recentIssues.css";

const priorityLabel = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const statusLabel = {
  todo: "Todo",
  in_progress: "In Progress",
  completed: "Completed",
};

const priorityClass = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
};

const statusClass = {
  todo: "status-todo",
  in_progress: "status-progress",
  completed: "status-resolved",
};

const IssueMiniCard = ({ issue }) => {
  if (!issue) return null;

  return (
    <div className="issue-card">
      <div className="issue-header">
        <span className="issue-id">{issue.issueKey}</span>

        <span
          className={`priority ${priorityClass[issue.priority]}`}
        >
          {priorityLabel[issue.priority]}
        </span>
      </div>

      <h4 className="issue-title">{issue.title}</h4>

      {issue.description && (
        <p className="issue-desc">{issue.description}</p>
      )}

      <div className="issue-footer">
        <span
          className={`status ${statusClass[issue.status]}`}
        >
          {statusLabel[issue.status]}
        </span>

        <div className="assignee">
          {issue.assignee?.name
            ? issue.assignee.name
            : "Unassigned"}
        </div>
      </div>
    </div>
  );
};

export default IssueMiniCard;
