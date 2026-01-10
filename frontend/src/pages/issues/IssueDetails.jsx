import { useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import IssueComments from "../../components/issues/IssueComments";
import "../../styles/issue.css";

const IssueDetails = () => {
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteIssue = () => {
    setShowDeleteModal(false);
    alert("Issue deleted (UI only)");
  };

  const issue = {
    id: id,
    title: "Login bug on Chrome",
    status: "Open",
    priority: "High",
    assignee: "Amit",
    description:
      "Users are unable to login on Chrome browser due to a token issue.",
  };

  return (
    <div className="issue-details-page">
      <div className="issue-details-header">
        <h2>Login bug on Chrome</h2>

        <button
          className="btn-link danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Issue
        </button>
      </div>

      <div className="issue-meta">
        <span className={`badge status-${issue.status.toLowerCase()}`}>
          {issue.status}
        </span>

        <span className={`badge priority-${issue.priority.toLowerCase()}`}>
          {issue.priority}
        </span>

        <span className="assignee">
          Assigned to: <strong>{issue.assignee}</strong>
        </span>
      </div>

      <div className="issue-section">
        <h5>Description</h5>
        <p>{issue.description}</p>
      </div>

      <IssueComments />

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Issue"
          message="Are you sure you want to delete this issue? This action cannot be undone."
          onConfirm={handleDeleteIssue}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default IssueDetails;
