import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const ManagerIssues = () => {
  const token = localStorage.getItem("token");

  const [issues, setIssues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assigning, setAssigning] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [issuesRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/issues", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/users?role=member", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setIssues(issuesRes.data);
      setMembers(usersRes.data);
    } catch (error) {
      console.error("Failed to load manager data", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatStatus = (status) =>
    status.replace("_", " ").toUpperCase();

  const assignIssue = async (issueId) => {
    if (!selectedUser) return;

    try {
      await axios.put(
        `http://localhost:5000/api/issues/${issueId}/assign`,
        { userId: selectedUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchData();
      setAssigning(null);
      setSelectedUser("");
    } catch {
      alert("Failed to assign issue");
    }
  };

  if (loading) return <p>Loading issues...</p>;

  return (
    <div className="card">
      <table className="issues-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td>{issue.title}</td>
              <td>{formatStatus(issue.status)}</td>
              <td>{issue.priority}</td>
              <td>{issue.assignee?.name || "Unassigned"}</td>

              <td>
                {issue.assignee ? (
                  "—"
                ) : assigning === issue._id ? (
                  <>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <option value="">Select member</option>
                      {members.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn-primary"
                      onClick={() => assignIssue(issue._id)}
                    >
                      Assign
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={() => setAssigning(issue._id)}
                  >
                    Assign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerIssues;
