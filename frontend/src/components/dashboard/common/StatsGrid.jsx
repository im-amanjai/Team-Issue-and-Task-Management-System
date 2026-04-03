import {
  ListChecks,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import "../../../styles/dashboard.css";

const StatsGrid = ({ issues }) => {
  const safeIssues = Array.isArray(issues) ? issues : [];

  const total = safeIssues.length;
  const todo = safeIssues.filter(
    (i) => i.status === "todo"
  ).length;
  const inProgress = safeIssues.filter(
    (i) => i.status === "in_progress"
  ).length;
  const completed = safeIssues.filter(
    (i) => i.status === "completed"
  ).length;

  const stats = [
    {
      title: "Total Issues",
      value: total,
      icon: <ListChecks />,
      highlight: true,
    },
    {
      title: "Todo",
      value: todo,
      icon: <AlertCircle />,
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: <Clock />,
    },
    {
      title: "Completed",
      value: completed,
      icon: <CheckCircle />,
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div
          key={s.title}
          className={`stat-card ${s.highlight ? "active" : ""}`}
        >
          <div>
            <p className="stat-title">{s.title}</p>
            <h2>{s.value}</h2>
          </div>
          <div className="stat-icon">{s.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
