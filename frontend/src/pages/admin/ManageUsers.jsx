import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUserRole } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");

  const loadUsers = () => {
    getUsers().then(setUsers).catch(() => setUsers([]));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await createUser(form);
      setForm({ name: "", email: "", password: "", role: "member" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create user");
    }
  };

  return (
    <div className="stack-lg">
      <section className="two-column">
        <article className="panel">
          <div className="panel-header">
            <h2>Create user</h2>
          </div>
          <form className="stack-md" onSubmit={handleCreate}>
            <input
              className="field"
              placeholder="Full name"
              value={form.name}
              onChange={(event) =>
                setForm((state) => ({ ...state, name: event.target.value }))
              }
            />
            <input
              className="field"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) =>
                setForm((state) => ({ ...state, email: event.target.value }))
              }
            />
            <input
              className="field"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) =>
                setForm((state) => ({ ...state, password: event.target.value }))
              }
            />
            <select
              className="field"
              value={form.role}
              onChange={(event) =>
                setForm((state) => ({ ...state, role: event.target.value }))
              }
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {error && <p className="error-text">{error}</p>}
            <button className="primary-btn" type="submit">
              Add user
            </button>
          </form>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Existing users</h2>
          </div>
          <div className="list-table">
            {users.map((user) => (
              <div className="issue-row" key={user._id}>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <div className="row-actions">
                  <select
                    className="inline-select"
                    value={user.role}
                    disabled={currentUser?._id === user._id}
                    onChange={async (event) => {
                      await updateUserRole(user._id, event.target.value);
                      loadUsers();
                    }}
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="danger-btn compact-btn"
                    disabled={currentUser?._id === user._id}
                    onClick={async () => {
                      await deleteUser(user._id);
                      loadUsers();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default ManageUsers;
