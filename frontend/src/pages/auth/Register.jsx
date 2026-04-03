import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen auth-screen">
      <section className="auth-hero">
        <p className="eyebrow">Project delivery</p>
        <h1>Create an account and join the workspace.</h1>
        <p>
          Admins can later adjust roles from the user management panel as the
          team grows.
        </p>
      </section>

      <section className="auth-card">
        <p className="eyebrow">Get started</p>
        <h2 className="auth-title">Create your account</h2>
        <form className="stack-md" onSubmit={handleSubmit}>
          <input
            className="field"
            placeholder="Full name"
            value={formData.name}
            onChange={(event) =>
              setFormData((state) => ({ ...state, name: event.target.value }))
            }
          />
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
          <select
            className="field"
            value={formData.role}
            onChange={(event) =>
              setFormData((state) => ({ ...state, role: event.target.value }))
            }
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
          </select>
          <p className="muted-text">
            Admin accounts are protected and cannot be created from public registration.
          </p>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="muted-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
