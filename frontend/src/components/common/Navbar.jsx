import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TEMP: clear frontend auth data
    localStorage.removeItem("role");

    // Redirect to login
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Team Issue Tracker</span>

      <button
        className="btn btn-outline-light btn-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
