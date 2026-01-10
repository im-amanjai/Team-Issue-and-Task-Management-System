import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./IssueStatusChart.css";

const data = [
  { name: "Open", value: 3, color: "#0ea5e9" },
  { name: "In Progress", value: 3, color: "#f59e0b" },
  { name: "Resolved", value: 1, color: "#22c55e" },
  { name: "Closed", value: 1, color: "#94a3b8" },
];

const IssuesStatusChart = () => {
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
