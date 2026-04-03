import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="center-screen">
      <div className="auth-card">
        <p className="eyebrow">404</p>
        <h1 className="auth-title">The page you are looking for does not exist.</h1>
        <Link className="primary-btn" to="/login">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
