const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const query = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(query).select("name email role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignableUsers = async (req, res) => {
  try {
    console.log("ASSIGNABLE API HIT. ROLE =", req.user.role);
    let roleToFetch = null;

    if (req.user.role === "admin") {
      roleToFetch = "manager";
    } else if (req.user.role === "manager") {
      roleToFetch = "member";
    } else {
      return res.status(403).json([]);
    }

    const users = await User.find({ role: roleToFetch })
      .select("_id name email");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
