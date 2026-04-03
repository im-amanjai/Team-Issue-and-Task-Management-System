import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyIssues } from "../../api/issueApi";
import "../../styles/issue.css";

const statusLabelMap = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
  completed: "Completed",
};

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getMyIssues(token)
      .then((res) => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load issues", err);
        setLoading(false);
      });
  }, [token]);

  const filteredIssues = issues.filter((issue) => {
    const statusMatch =
      statusFilter === "all" || issue.status === statusFilter;

    const priorityMatch =
      priorityFilter === "all" || issue.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  if (loading) {
    return <div className="issues-page">Loading...</div>;
  }

  return (
    <div className="issues-page">
      <div className="issues-header">
        <h2>My Issues</h2>
        <p className="text-muted">Issues assigned to you</p>
      </div>

      <div className="issues-filters">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="issues-table-wrapper">
        <table className="issues-table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Project</th>
            </tr>
          </thead>

          <tbody>
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No issues found
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => (
                <tr key={issue._id}>
                  <td className="issue-title">
                    <Link
                      to={`/member/issues/${issue._id}`}
                      className="issue-link"
                    >
                      {issue.issueKey} – {issue.title}
                    </Link>
                  </td>

                  <td>
                    <span
                      className={`badge status-${issue.status}`}
                    >
                      {statusLabelMap[issue.status]}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge priority-${issue.priority}`}
                    >
                      {issue.priority}
                    </span>
                  </td>

                  <td>{issue.project?.key || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyIssues;
