import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const ManagerIssueDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [issue, setIssue] = useState(null);
  const [members, setMembers] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setIssue(res.data));

    if (user.role === "manager") {
      axios
        .get("http://localhost:5000/api/users?role=member", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMembers(res.data));
    }
  }, [id, token, user.role]);

  const updateStatus = async () => {
    await axios.put(
      `http://localhost:5000/api/issues/${id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const res = await axios.get(
      `http://localhost:5000/api/issues/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setIssue(res.data);
  };

  const reassignIssue = async () => {
    await axios.put(
      `http://localhost:5000/api/issues/${id}/assign`,
      { userId: newAssignee },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const res = await axios.get(
      `http://localhost:5000/api/issues/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setIssue(res.data);
  };

  if (!issue) return <p>Loading issue...</p>;

  return (
    <div className="card">
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>

      <p><strong>Status:</strong> {issue.status}</p>
      <p><strong>Priority:</strong> {issue.priority}</p>
      <p><strong>Assignee:</strong> {issue.assignee?.name || "Unassigned"}</p>

      {/* STATUS UPDATE */}
      <div>
        <select onChange={(e) => setNewStatus(e.target.value)}>
          <option value="">Change status</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={updateStatus}>Update Status</button>
      </div>

      {/* REASSIGN (Manager only) */}
      {user.role === "manager" && (
        <div>
          <select onChange={(e) => setNewAssignee(e.target.value)}>
            <option value="">Reassign issue</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
          <button onClick={reassignIssue}>Reassign</button>
        </div>
      )}
    </div>
  );
};

export default ManagerIssueDetail;
