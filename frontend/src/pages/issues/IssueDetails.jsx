import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import IssueComments from "../../components/issues/IssueComments";
import { getIssueById, deleteIssue } from "../../api/issueApi";
import "../../styles/issue.css";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await getIssueById(id);
        setIssue(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load issue");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleDeleteIssue = async () => {
    try {
      await deleteIssue(issue._id);
      setShowDeleteModal(false);
      toast.success("Issue deleted");
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete issue");
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <div className="issue-details-page">Loading issue details...</div>;
  }

  if (error) {
    return <div className="issue-details-page"><p className="error-text">{error}</p></div>;
  }

  if (!issue) {
    return <div className="issue-details-page"><p>Issue not found.</p></div>;
  }

  return (
    <div className="issue-details-page">
      <div className="issue-details-header">
        <h2>{issue.title}</h2>

        <button
          className="btn-link danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Issue
        </button>
      </div>

      <div className="issue-meta">
        <span className={`badge status-${issue.status}`}>
          {issue.status.replace("_", " ")}
        </span>

        <span className={`badge priority-${issue.priority}`}>
          {issue.priority}
        </span>

        <span className="assignee">
          Assigned to: <strong>{issue.assignee?.name || "Unassigned"}</strong>
        </span>
      </div>

      <div className="issue-section">
        <h5>Description</h5>
        <p>{issue.description}</p>
      </div>

      <IssueComments issueId={issue._id} />

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
