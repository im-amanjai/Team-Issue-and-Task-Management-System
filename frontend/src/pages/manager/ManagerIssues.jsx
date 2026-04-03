import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteIssue, getIssues } from "../../api/issueApi";
import { useAuth } from "../../context/AuthContext";

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  category: "",
};

const ManagerIssues = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  const loadIssues = () => {
    getIssues(filters).then(setIssues).catch(() => setIssues([]));
  };

  useEffect(() => {
    loadIssues();
  }, [filters.search, filters.status, filters.priority, filters.category]);

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="panel-header">
          <h2>Issue filters</h2>
        </div>
        <div className="form-grid">
          <input
            className="field"
            placeholder="Search title, description, or key"
            value={filters.search}
            onChange={(event) =>
              setFilters((state) => ({ ...state, search: event.target.value }))
            }
          />
          <select
            className="field"
            value={filters.status}
            onChange={(event) =>
              setFilters((state) => ({ ...state, status: event.target.value }))
            }
          >
            <option value="">All status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="field"
            value={filters.priority}
            onChange={(event) =>
              setFilters((state) => ({ ...state, priority: event.target.value }))
            }
          >
            <option value="">All priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="field"
            value={filters.category}
            onChange={(event) =>
              setFilters((state) => ({ ...state, category: event.target.value }))
            }
          >
            <option value="">All category</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="task">Task</option>
          </select>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Issue list</h2>
        </div>

        <div className="list-table">
          {issues.length === 0 ? (
            <p className="muted-text">No issues match these filters.</p>
          ) : (
            issues.map((issue) => (
              <div className="issue-row issue-row-card" key={issue._id}>
                <div>
                  <strong>
                    {issue.issueKey} - {issue.title}
                  </strong>
                  <p>{issue.description}</p>
                </div>
                <div className="issue-meta issue-actions">
                  <span>{issue.category}</span>
                  <span>{issue.priority}</span>
                  <span>{issue.status.replace("_", " ")}</span>
                  <button
                    className="secondary-btn compact-btn"
                    onClick={() => navigate(issue._id)}
                  >
                    View
                  </button>
                  {user.role === "admin" && (
                    <button
                      className="danger-btn compact-btn"
                      onClick={async () => {
                        await deleteIssue(issue._id);
                        loadIssues();
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ManagerIssues;
