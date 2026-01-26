const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  getUsers,
  getAssignableUsers,
} = require("../controllers/userController");

// Assignable users (Admin -> Managers, Manager -> Members)
router.get(
  "/assignable",
  verifyToken,
  allowRoles("admin", "manager"),
  getAssignableUsers
);

// Generic users fetch (keep existing behavior)
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "manager"),
  getUsers
);

module.exports = router;
