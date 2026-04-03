import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      login(data.user);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen auth-screen">
      <section className="auth-hero">
        <p className="eyebrow">Internal collaboration platform</p>
        <h1>Track bugs, assign work, and keep your team aligned.</h1>
        <p>
          This project delivers role-based dashboards, issue workflows,
          comments, notifications, and user management in one place.
        </p>
      </section>

      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h2 className="auth-title">Sign in to IssueTrack Pro</h2>
        <form className="stack-md" onSubmit={handleSubmit}>
          <input
            className="field"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(event) =>
              setFormData((state) => ({ ...state, email: event.target.value }))
            }
          />
          <input
            className="field"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(event) =>
              setFormData((state) => ({ ...state, password: event.target.value }))
            }
          />
          <input
            className="field"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Admin access code (admins only)"
            value={formData.adminCode}
            onChange={(event) =>
              setFormData((state) => ({
                ...state,
                adminCode: event.target.value.replace(/\D/g, "").slice(0, 4),
              }))
            }
          />
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="muted-text">
          Admin login requires your private 4-digit code.
        </p>
        <p className="muted-text">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
