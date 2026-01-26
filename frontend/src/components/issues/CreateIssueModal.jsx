import { X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const CreateIssueModal = ({ role, onClose }) => {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "task",
    priority: "medium",
    assignedTo: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Fetch assignable users
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

  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      ...(form.assignedTo && { assignee: form.assignedTo }),
    };

    try {
      await axios.post("http://localhost:5000/api/issues", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create issue");
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
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Create Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;
