const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  assignIssue,
  updateStatus,
  deleteIssue,
} = require("../controllers/issueController");

router.post("/", verifyToken, createIssue);
router.get("/", verifyToken, getIssues);
router.get("/:id", verifyToken, getIssueById);
router.patch("/:id", verifyToken, updateIssue);
router.patch("/:id/assign", verifyToken, allowRoles("admin", "manager"), assignIssue);
router.patch("/:id/status", verifyToken, updateStatus);
router.delete("/:id", verifyToken, allowRoles("admin"), deleteIssue);

module.exports = router;
