import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const IssueCard = ({ issue }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (user.role === "member") {
      navigate(`/member/issues/${issue._id}`);
    } else if (user.role === "manager") {
      navigate(`/manager/issues/${issue._id}`);
    }
  };

  return (
    <div
      className="card mb-2"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <div className="card-body">
        <h6>{issue.title}</h6>
        <p className="mb-1">Status: {issue.status}</p>
        <p className="mb-0">Priority: {issue.priority}</p>
      </div>
    </div>
  );
};

export default IssueCard;
