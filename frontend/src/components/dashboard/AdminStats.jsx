const AdminStats = () => {
  const totalUsers = 12;
  const totalIssues = 34;

  const issuesByStatus = {
    Open: 10,
    "In Progress": 14,
    Resolved: 8,
    Closed: 2,
  };

  const issuesByPriority = {
    High: 12,
    Medium: 15,
    Low: 7,
  };

  return (
    <div className="dashboard-content">
      {/* Top cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h6>Total Users</h6>
          <h3>{totalUsers}</h3>
        </div>

        <div className="stat-card">
          <h6>Total Issues</h6>
          <h3>{totalIssues}</h3>
        </div>
      </div>

      {/* Issues by Status */}
      <div className="stats-section">
        <h5>Issues by Status</h5>

        <div className="stats-list">
          {Object.entries(issuesByStatus).map(([status, count]) => (
            <div key={status} className="stats-row">
              <span>{status}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Issues by Priority */}
      <div className="stats-section">
        <h5>Issues by Priority</h5>

        <div className="stats-list">
          {Object.entries(issuesByPriority).map(([priority, count]) => (
            <div key={priority} className="stats-row">
              <span>{priority}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
