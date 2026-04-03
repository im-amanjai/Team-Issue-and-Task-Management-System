import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  assignIssue,
  deleteIssue,
  getIssueById,
  updateIssueStatus,
} from "../../api/issueApi";
import {
  addComment,
  deleteComment,
  getCommentsByIssue,
} from "../../api/commentApi";
import { getAssignableUsers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const memberStatusOptions = ["in_progress", "completed"];

const IssueDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const loadPage = async () => {
    try {
      const [issueData, commentData] = await Promise.all([
        getIssueById(id),
        getCommentsByIssue(id),
      ]);
      setIssue(issueData);
      setComments(commentData);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load issue");
    }
  };

  useEffect(() => {
    loadPage();
  }, [id]);

  useEffect(() => {
    if (user.role === "member") return;
    getAssignableUsers().then(setAssignableUsers).catch(() => setAssignableUsers([]));
  }, [user.role]);

  if (!issue) {
    return <section className="panel">Loading issue details...</section>;
  }

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{issue.issueKey}</p>
            <h2>{issue.title}</h2>
          </div>
          {user.role === "admin" && (
            <button
              className="danger-btn"
              onClick={async () => {
                await deleteIssue(issue._id);
                navigate(`/${user.role}/issues`);
              }}
            >
              Delete issue
            </button>
          )}
        </div>

        <p className="detail-description">{issue.description}</p>

        <div className="detail-grid">
          <div className="detail-item">
            <span>Status</span>
            <strong>{issue.status.replace("_", " ")}</strong>
          </div>
          <div className="detail-item">
            <span>Priority</span>
            <strong>{issue.priority}</strong>
          </div>
          <div className="detail-item">
            <span>Category</span>
            <strong>{issue.category}</strong>
          </div>
          <div className="detail-item">
            <span>Reporter</span>
            <strong>{issue.reporter?.name || "Unknown"}</strong>
          </div>
          <div className="detail-item">
            <span>Assignee</span>
            <strong>{issue.assignee?.name || "Unassigned"}</strong>
          </div>
        </div>

        <div className="form-grid align-end">
          {user.role !== "member" && (
            <select
              className="field"
              value={issue.assignee?._id || ""}
              onChange={async (event) => {
                const updated = await assignIssue(issue._id, event.target.value || null);
                setIssue(updated);
              }}
            >
              <option value="">Unassigned</option>
              {assignableUsers.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          )}

          {user.role === "member" && (
            <select
              className="field"
              value=""
              onChange={async (event) => {
                if (!event.target.value) return;
                const updated = await updateIssueStatus(issue._id, event.target.value);
                setIssue(updated);
              }}
            >
              <option value="">Change status</option>
              {memberStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Comments</h3>
        </div>
        <form
          className="comment-form"
          onSubmit={async (event) => {
            event.preventDefault();
            const newComment = await addComment({
              issueId: issue._id,
              text: commentText,
            });
            setComments((items) => [...items, newComment]);
            setCommentText("");
          }}
        >
          <textarea
            className="field textarea"
            placeholder="Add a comment"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <button className="primary-btn" type="submit">
            Post comment
          </button>
        </form>

        <div className="stack-md">
          {comments.length === 0 ? (
            <p className="muted-text">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <article className="comment-card" key={comment._id}>
                <div className="panel-header">
                  <div>
                    <strong>{comment.userId?.name || "User"}</strong>
                    <p className="muted-text small-text">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {user.role === "admin" && (
                    <button
                      className="link-button danger-text"
                      onClick={async () => {
                        await deleteComment(comment._id);
                        setComments((items) =>
                          items.filter((item) => item._id !== comment._id)
                        );
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p>{comment.text}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default IssueDetail;
