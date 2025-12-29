const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  adminDashboard,
  managerDashboard,
  memberDashboard
} = require("../controllers/dashboardController");

// Admin dashboard
router.get(
  "/admin",
  verifyToken,
  allowRoles("admin"),
  adminDashboard
);

// Manager dashboard
router.get(
  "/manager",
  verifyToken,
  allowRoles("manager"),
  managerDashboard
);

// Member dashboard
router.get(
  "/member",
  verifyToken,
  allowRoles("member"),
  memberDashboard
);

module.exports = router;
