import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createIssue } from "../../api/issueApi";
import { getAssignableUsers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const CreateIssue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "task",
    priority: "medium",
    assignee: "",
    dueDate: "",
  });

  useEffect(() => {
    if (user.role === "member") return;
    getAssignableUsers().then(setAssignableUsers).catch(() => setAssignableUsers([]));
  }, [user.role]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("priority", form.priority);
      if (form.assignee) formData.append("assignee", form.assignee);
      if (form.dueDate) formData.append("dueDate", form.dueDate);
      files.forEach((file) => formData.append("files", file));

      const issue = await createIssue(formData);
      toast.success("Issue created successfully");
      navigate(`/${user.role}/issues/${issue._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create issue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel panel-form">
      <div className="panel-header">
        <h2>Create issue</h2>
      </div>

      {user.role !== "manager" && (
        <p className="error-text">Only managers can create and assign issues.</p>
      )}

      <form className="stack-md" onSubmit={handleSubmit}>
        <input
          className="field"
          placeholder="Issue title"
          value={form.title}
          onChange={(event) =>
            setForm((state) => ({ ...state, title: event.target.value }))
          }
        />
        <textarea
          className="field textarea"
          placeholder="Describe the issue"
          value={form.description}
          onChange={(event) =>
            setForm((state) => ({ ...state, description: event.target.value }))
          }
        />
        <div className="form-grid">
          <select
            className="field"
            value={form.category}
            onChange={(event) =>
              setForm((state) => ({ ...state, category: event.target.value }))
            }
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="task">Task</option>
          </select>
          <select
            className="field"
            value={form.priority}
            onChange={(event) =>
              setForm((state) => ({ ...state, priority: event.target.value }))
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due date (optional)</label>
          <input
            className="field"
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              setForm((state) => ({ ...state, dueDate: event.target.value }))
            }
          />
        </div>

        {user.role !== "member" && (
          <select
            className="field"
            value={form.assignee}
            onChange={(event) =>
              setForm((state) => ({ ...state, assignee: event.target.value }))
            }
          >
            <option value="">Unassigned</option>
            {assignableUsers.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name} ({option.email})
              </option>
            ))}
          </select>
        )}

        {/* File Attachments */}
        <div className="form-group">
          <label>Attachments (optional, max 5 files)</label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            accept="image/*,application/pdf,text/plain,text/csv,application/json,application/zip"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="secondary-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose files
          </button>
          {files.length > 0 && (
            <div className="stack-md" style={{ marginTop: 8 }}>
              {files.map((file, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border, #eee)" }}>
                  <span>{file.name} ({formatSize(file.size)})</span>
                  <button type="button" className="link-button danger-text" onClick={() => removeFile(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" type="submit" disabled={user.role !== "manager" || submitting}>
          {submitting ? "Creating..." : "Create issue"}
        </button>
      </form>
    </section>
  );
};

export default CreateIssue;
