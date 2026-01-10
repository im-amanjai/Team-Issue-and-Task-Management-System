const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  createIssue,
  getIssues,
  assignIssue,
  updateStatus,
  deleteIssue,
} = require("../controllers/issueController");

// Create issue → Admin & Manager only
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "manager"),
  createIssue
);

// Get issues → All roles (visibility handled in controller)
router.get(
  "/",
  verifyToken,
  getIssues
);

// Assign issue → Admin & Manager
router.put(
  "/:id/assign",
  verifyToken,
  allowRoles("admin", "manager"),
  assignIssue
);

// Update status → All roles (rules enforced in controller)
router.put(
  "/:id/status",
  verifyToken,
  updateStatus
);

// Delete issue → Admin only
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  deleteIssue
);

module.exports = router;
