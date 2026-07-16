import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/authApi";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await updateProfile(payload);
      localStorage.setItem("token", res.token);
      login(res.user);
      setEditing(false);
      setForm((s) => ({ ...s, currentPassword: "", newPassword: "" }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Account</p>
            <h2>Profile</h2>
          </div>
          {!editing && (
            <button className="secondary-btn" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          )}
        </div>

        {editing ? (
          <form className="stack-md" onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  className="field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="field"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Current password (required to change password)</label>
              <input
                className="field"
                type="password"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>New password (leave blank to keep current)</label>
              <input
                className="field"
                type="password"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="primary-btn" disabled={saving} type="submit">
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button className="secondary-btn" type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
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
        )}
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
