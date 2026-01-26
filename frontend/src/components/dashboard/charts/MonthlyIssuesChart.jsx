import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./MonthlyIssuesChart.css";

const MonthlyIssuesChart = ({ issues }) => {
  const safeIssues = Array.isArray(issues) ? issues : [];

  const monthMap = {};

  safeIssues.forEach((issue) => {
    if (!issue.createdAt) return;

    const date = new Date(issue.createdAt);
    const month = date.toLocaleString("default", { month: "short" });

    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const data = Object.keys(monthMap).map((month) => ({
    month,
    issues: monthMap[month],
  }));

  return (
    <div className="chart-card">
      <h3>Monthly Issues</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#8fa3c7" />
          <YAxis stroke="#8fa3c7" allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="issues"
            fill="#14b8a6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyIssuesChart;
