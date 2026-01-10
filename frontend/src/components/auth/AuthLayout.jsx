import "../../styles/auth.css";

const AuthLayout = ({
  title,
  subtitle,
  children,
  sideTitle,
  sideText,
}) => {
  return (
    <div className="auth-container">
      {/* Left */}
      <div className="auth-left">
        <div className="auth-logo">
          <span className="bug">🐞</span>
          <span>IssueTrack</span>
        </div>

        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        {children}
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-illustration">
          <span className="bug-large">🐞</span>
        </div>
        <h2>{sideTitle}</h2>
        <p>{sideText}</p>
      </div>
    </div>
  );
};

export default AuthLayout;
