const IssueCard = ({ issue }) => {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h6>{issue.title}</h6>
        <p className="mb-1">Status: {issue.status}</p>
        <p className="mb-0">Priority: {issue.priority}</p>
      </div>
    </div>
  );
};

export default IssueCard;
