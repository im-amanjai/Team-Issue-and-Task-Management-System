import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./MonthlyIssuesChart.css";

const data = [
  { month: "Nov", issues: 12 },
  { month: "Dec", issues: 18 },
  { month: "Jan", issues: 8 },
];

const MonthlyIssuesChart = () => {
  return (
    <div className="chart-card">
      <h3>Monthly Issues</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#8fa3c7" />
          <YAxis stroke="#8fa3c7" />
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
