import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIssue } from "../../api/issueApi";
import { getAssignableUsers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const CreateIssue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "task",
    priority: "medium",
    assignee: "",
  });

  useEffect(() => {
    if (user.role === "member") return;
    getAssignableUsers().then(setAssignableUsers).catch(() => setAssignableUsers([]));
  }, [user.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const issue = await createIssue({
        ...form,
        assignee: form.assignee || undefined,
      });
      navigate(`/${user.role}/issues/${issue._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create issue");
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

        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" type="submit" disabled={user.role !== "manager"}>
          Create issue
        </button>
      </form>
    </section>
  );
};

export default CreateIssue;
