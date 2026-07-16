import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
import {
  uploadAttachment,
  getAttachmentsByIssue,
  deleteAttachment,
} from "../../api/attachmentApi";
import { getAssignableUsers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const memberStatusOptions = ["in_progress", "completed"];

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const IssueDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");

  const loadPage = async () => {
    try {
      const [issueData, commentData, attachmentData, logData] = await Promise.all([
        getIssueById(id),
        getCommentsByIssue(id),
        getAttachmentsByIssue(id),
        axiosInstance.get(`/api/activity-logs/issue/${id}`).then((r) => r.data),
      ]);
      setIssue(issueData);
      setComments(commentData);
      setAttachments(attachmentData);
      setActivityLogs(logData);
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const newAttachment = await uploadAttachment(issue._id, file);
      setAttachments((prev) => [newAttachment, ...prev]);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAttachment = async (attId) => {
    try {
      await deleteAttachment(attId);
      setAttachments((prev) => prev.filter((a) => a._id !== attId));
      toast.success("Attachment deleted");
    } catch (err) {
      toast.error("Failed to delete attachment");
    }
  };

  if (!issue) {
    return <section className="panel">Loading issue details...</section>;
  }

  const actionLabel = (action) => {
    const map = {
      created: "created this issue",
      updated: "updated",
      status_changed: "changed status",
      assigned: "reassigned",
      commented: "commented",
      attachment_added: "uploaded a file",
      attachment_deleted: "deleted an attachment",
    };
    return map[action] || action;
  };

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{issue.issueKey}</p>
            <h2>{issue.title}</h2>
          </div>
          {(user.role === "admin" || (user.role === "manager" && issue.reporter?._id === user._id)) && (
            <button
              className="danger-btn"
              onClick={async () => {
                try {
                  await deleteIssue(issue._id);
                  toast.success("Issue deleted");
                  navigate(`/${user.role}/issues`);
                } catch (err) {
                  toast.error(err.response?.data?.message || "Failed to delete issue");
                }
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
          {issue.dueDate && (
            <div className="detail-item">
              <span>Due date</span>
              <strong>{new Date(issue.dueDate).toLocaleDateString()}</strong>
            </div>
          )}
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
                try {
                  const updated = await updateIssueStatus(issue._id, event.target.value);
                  setIssue(updated);
                  toast.success("Status updated");
                } catch (err) {
                  toast.error(err.response?.data?.message || "Failed to update status");
                }
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

      {/* Attachments Section */}
      <section className="panel">
        <div className="panel-header">
          <h3>Attachments ({attachments.length})</h3>
          <button
            className="secondary-btn compact-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload file"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            accept="image/*,application/pdf,text/plain,text/csv,application/json,application/zip"
            onChange={handleFileUpload}
          />
        </div>
        {attachments.length === 0 ? (
          <p className="muted-text">No files attached yet.</p>
        ) : (
          <div className="stack-md">
            {attachments.map((att) => (
              <div key={att._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border, #eee)" }}>
                <div>
                  <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>
                    {att.originalName}
                  </a>
                  <p className="muted-text small-text">
                    {formatSize(att.size)} - {att.userId?.name || "Unknown"} - {new Date(att.createdAt).toLocaleString()}
                  </p>
                </div>
                {(user.role === "admin" || att.userId?._id === user._id) && (
                  <button
                    className="link-button danger-text"
                    onClick={() => handleDeleteAttachment(att._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tabs: Comments / Activity */}
      <section className="panel">
        <div className="panel-header" style={{ gap: 16 }}>
          <button
            className={activeTab === "comments" ? "primary-btn" : "secondary-btn"}
            onClick={() => setActiveTab("comments")}
          >
            Comments ({comments.length})
          </button>
          <button
            className={activeTab === "activity" ? "primary-btn" : "secondary-btn"}
            onClick={() => setActiveTab("activity")}
          >
            Activity ({activityLogs.length})
          </button>
        </div>

        {activeTab === "comments" && (
          <>
            <form
              className="comment-form"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!commentText.trim()) return;
                setSubmitting(true);
                try {
                  const newComment = await addComment({
                    issueId: issue._id,
                    text: commentText,
                  });
                  setComments((items) => [...items, newComment]);
                  setCommentText("");
                } catch (err) {
                  toast.error(err.response?.data?.message || "Failed to add comment");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <textarea
                className="field textarea"
                placeholder="Add a comment"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
              <button className="primary-btn" type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post comment"}
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
          </>
        )}

        {activeTab === "activity" && (
          <div className="stack-md">
            {activityLogs.length === 0 ? (
              <p className="muted-text">No activity recorded yet.</p>
            ) : (
              activityLogs.map((log) => (
                <div key={log._id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border, #eee)" }}>
                  <p>
                    <strong>{log.userId?.name || "User"}</strong>{" "}
                    {actionLabel(log.action)}
                    {log.field && (
                      <span className="muted-text">
                        {" "}({log.field}: {String(log.oldValue)} → {String(log.newValue)})
                      </span>
                    )}
                  </p>
                  <p className="muted-text small-text">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default IssueDetail;
