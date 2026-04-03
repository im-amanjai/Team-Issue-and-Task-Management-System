import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="center-screen">
      <div className="auth-card">
        <p className="eyebrow">Access denied</p>
        <h1 className="auth-title">You do not have permission to view this page.</h1>
        <Link className="primary-btn" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
