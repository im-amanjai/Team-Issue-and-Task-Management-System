import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getIssueById,
  updateIssueStatus,
  addComment,
} from "../../api/issueApi";

const IssueDetail = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [issue, setIssue] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getIssueById(id, token).then((res) => setIssue(res.data));
  }, [id, token]);

  const handleStatusChange = (status) => {
    updateIssueStatus(id, status, token).then((res) =>
      setIssue(res.data.issue)
    );
  };

  const handleComment = () => {
    if (!comment.trim()) return;

    addComment(id, comment, token).then(() => {
      setComment("");
      getIssueById(id, token).then((res) => setIssue(res.data));
    });
  };

  if (!issue) return <div>Loading...</div>;

  return (
    <div className="issue-detail">
      <h2>
        {issue.issueKey} – {issue.title}
      </h2>

      <p>{issue.description}</p>

      <p>Status: {issue.status}</p>
      <p>Priority: {issue.priority}</p>
      <p>Assignee: {issue.assignee?.name}</p>

      {issue.status === "todo" && (
        <button onClick={() => handleStatusChange("in_progress")}>
          Start Progress
        </button>
      )}

      {issue.status === "in_progress" && (
        <button onClick={() => handleStatusChange("done")}>
          Mark Done
        </button>
      )}

      <h3>Comments</h3>

      <ul>
        {issue.comments?.map((c, i) => (
          <li key={i}>
            <strong>{c.user?.name || "User"}:</strong> {c.message}
          </li>
        ))}
      </ul>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleComment}>Add Comment</button>
    </div>
  );
};

export default IssueDetail;
