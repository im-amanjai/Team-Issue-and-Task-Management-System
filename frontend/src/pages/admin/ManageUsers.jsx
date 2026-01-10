import { useState } from "react";
import "../../styles/user.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Amit", email: "amit@test.com", role: "admin" },
    { id: 2, name: "Riya", email: "riya@test.com", role: "manager" },
    { id: 3, name: "Dev", email: "dev@test.com", role: "member" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "member",
  });

  const handleCreateUser = (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email) return;

    setUsers([
      ...users,
      { id: Date.now(), ...newUser },
    ]);

    setNewUser({ name: "", email: "", role: "member" });
  };

  const handleRoleChange = (id, role) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, role } : user
      )
    );
  };

  return (
    <div className="users-page">
      <h2>Manage Users</h2>
      <p className="text-muted">
        Create users and assign roles
      </p>

      <div className="user-card">
        <h5>Create User</h5>

        <form onSubmit={handleCreateUser} className="user-form">
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />

          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option>Admin</option>
            <option>Manager</option>
            <option>Member</option>
          </select>

          <button type="submit">Create User</button>
        </form>
      </div>

      <div className="user-card">
        <h5>Users</h5>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Member</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
