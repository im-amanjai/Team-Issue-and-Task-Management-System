import { Link } from "react-router-dom";

const labels = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
  low: "Low",
  medium: "Medium",
  high: "High",
};

const DashboardOverview = ({ title, subtitle, issues, extraCards = [] }) => {
  const totalIssues = issues.length;
  const openIssues = issues.filter((issue) => issue.status === "open").length;
  const inProgress = issues.filter((issue) => issue.status === "in_progress").length;
  const completed = issues.filter((issue) => issue.status === "completed").length;
  const recentIssues = issues.slice(0, 5);

  const cards = [
    { label: "Total issues", value: totalIssues },
    { label: "Open", value: openIssues },
    { label: "In progress", value: inProgress },
    { label: "Completed", value: completed },
    ...extraCards,
  ];

  const byStatus = Object.entries(
    issues.reduce((accumulator, issue) => {
      accumulator[issue.status] = (accumulator[issue.status] || 0) + 1;
      return accumulator;
    }, {})
  );

  const byPriority = Object.entries(
    issues.reduce((accumulator, issue) => {
      accumulator[issue.priority] = (accumulator[issue.priority] || 0) + 1;
      return accumulator;
    }, {})
  );

  return (
    <div className="stack-lg">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Role dashboard</p>
          <h2>{title}</h2>
          <p className="panel-subtitle">{subtitle}</p>
        </div>
        <Link to="issues" className="primary-btn">
          Open issues
        </Link>
      </section>

      <section className="stats-grid">
        {cards.map((card) => (
          <article key={card.label} className="stat-card">
            <p>{card.label}</p>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="two-column">
        <article className="panel">
          <div className="panel-header">
            <h3>Status breakdown</h3>
          </div>
          <div className="tag-grid">
            {byStatus.length === 0 ? (
              <p className="muted-text">No issues yet.</p>
            ) : (
              byStatus.map(([key, value]) => (
                <div key={key} className="metric-pill">
                  <span>{labels[key] || key}</span>
                  <strong>{value}</strong>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Priority mix</h3>
          </div>
          <div className="tag-grid">
            {byPriority.length === 0 ? (
              <p className="muted-text">No priorities available.</p>
            ) : (
              byPriority.map(([key, value]) => (
                <div key={key} className="metric-pill">
                  <span>{labels[key] || key}</span>
                  <strong>{value}</strong>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Recently updated issues</h3>
        </div>
        <div className="list-table">
          {recentIssues.length === 0 ? (
            <p className="muted-text">No recent issues yet.</p>
          ) : (
            recentIssues.map((issue) => (
              <Link key={issue._id} to={`issues/${issue._id}`} className="issue-row">
                <div>
                  <strong>{issue.issueKey}</strong>
                  <p>{issue.title}</p>
                </div>
                <div className="issue-meta">
                  <span>{labels[issue.status] || issue.status}</span>
                  <span>{labels[issue.priority] || issue.priority}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;
