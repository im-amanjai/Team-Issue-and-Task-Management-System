import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetCode, setResetCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.resetCode) {
        setResetCode(res.resetCode);
        toast.success("Reset code generated (check console for dev)");
      } else {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen auth-screen">
      <section className="auth-card">
        <p className="eyebrow">Password Recovery</p>
        <h2 className="auth-title">Forgot your password?</h2>
        <form className="stack-md" onSubmit={handleSubmit}>
          <input
            className="field"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="primary-btn" disabled={loading} type="submit">
            {loading ? "Sending..." : "Send reset code"}
          </button>
        </form>
        {resetCode && (
          <p className="muted-text" style={{ marginTop: 12, wordBreak: "break-all" }}>
            Dev mode reset code: <strong>{resetCode}</strong>
          </p>
        )}
        <p className="muted-text">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
};

export default ForgotPassword;
