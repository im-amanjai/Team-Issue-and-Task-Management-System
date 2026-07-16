import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const CreateIssueModal = ({ role, onClose }) => {
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "task",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    if (role === "member") return;

    setLoadingUsers(true);

    axios
      .get("http://localhost:5000/api/users/assignable", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [role, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("priority", form.priority);
    if (form.assignedTo) formData.append("assignee", form.assignedTo);
    if (form.dueDate) formData.append("dueDate", form.dueDate);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("http://localhost:5000/api/issues", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Issue created successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create issue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Create New Issue</h2>
          <button className="icon-btn modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief issue summary"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed description..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
                <option value="task">Task</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {(role === "admin" || role === "manager") && (
            <div className="form-group">
              <label>Assign to</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={loadingUsers}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Due date (optional)</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

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
              style={{ marginBottom: 6 }}
            >
              Choose files
            </button>
            {files.length > 0 && (
              <div className="stack-md">
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
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Issue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;
