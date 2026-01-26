import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateIssue = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "bug",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/issues",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/manager/issues");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="card" style={{ maxWidth: "800px" }}>
        <h2>Create Issue</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Issue title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe the issue"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Category + Priority */}
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

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/manager/issues")}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Issue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIssue;
