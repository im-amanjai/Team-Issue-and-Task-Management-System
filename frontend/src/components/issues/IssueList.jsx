import { Link } from "react-router-dom";

const IssuesList = () => {
  const issues = [
    { id: 1, title: "Login bug", status: "Open", priority: "High" },
    { id: 2, title: "Dashboard UI fix", status: "In Progress", priority: "Medium" },
    { id: 3, title: "API error", status: "Resolved", priority: "Low" },
  ];

  return (
    <div>
      <h2 className="mb-4">Issues</h2>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.title}</td>
              <td>{issue.status}</td>
              <td>{issue.priority}</td>
              <td>
                <Link
                  to={`/admin/issues/${issue.id}`}
                  className="btn btn-sm btn-primary"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesList;
