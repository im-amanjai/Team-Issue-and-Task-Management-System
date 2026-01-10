import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";

const IssueComments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Riya",
      text: "I am looking into this issue.",
    },
    {
      id: 2,
      author: "Admin",
      text: "Please prioritize this bug.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const handleDeleteComment = () => {
    setComments(
      comments.filter(
        (comment) => comment.id !== selectedComment.id
      )
    );

    setSelectedComment(null);
    setShowModal(false);
  };

  return (
    <div className="issue-section">
      <h5>Comments</h5>

      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <strong>{comment.author}</strong>
          <p>{comment.text}</p>

          <button
            className="btn-link danger small"
            onClick={() => {
              setSelectedComment(comment);
              setShowModal(true);
            }}
          >
            Delete
          </button>
        </div>
      ))}

      {showModal && selectedComment && (
        <ConfirmModal
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
          onConfirm={handleDeleteComment}
          onCancel={() => {
            setSelectedComment(null);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default IssueComments;
