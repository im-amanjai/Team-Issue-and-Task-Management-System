import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Account</p>
            <h2>Profile</h2>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span>Name</span>
            <strong>{user?.name}</strong>
          </div>
          <div className="detail-item">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div className="detail-item">
            <span>Role</span>
            <strong>{user?.role}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Session</p>
            <h3>Account actions</h3>
          </div>
        </div>

        <div className="stack-md profile-actions">
          <button
            className="danger-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
