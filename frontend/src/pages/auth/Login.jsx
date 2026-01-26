import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role) => {
    if (role === "admin") navigate("/admin");
    else if (role === "manager") navigate("/manager");
    else navigate("/member");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);
      login(data.user);
      localStorage.setItem("token", data.token);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue"
      sideTitle="Track Issues Efficiently"
      sideText="Manage tasks and issues with clarity."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
