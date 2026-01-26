import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./IssueStatusChart.css";

const IssuesStatusChart = ({ issues }) => {
  const safeIssues = Array.isArray(issues) ? issues : [];

  const counts = {
    todo: 0,
    in_progress: 0,
    resolved: 0,
  };

  safeIssues.forEach((issue) => {
    if (counts[issue.status] !== undefined) {
      counts[issue.status]++;
    }
  });

  const data = [
    { name: "Todo", value: counts.todo, color: "#0ea5e9" },
    { name: "In Progress", value: counts.in_progress, color: "#f59e0b" },
    { name: "Resolved", value: counts.resolved, color: "#22c55e" },
  ];

  return (
    <div className="chart-card">
      <h3>Issues by Status</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssuesStatusChart;
