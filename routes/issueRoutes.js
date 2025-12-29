const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  createIssue,
  getIssues,
  assignIssue,
  updateStatus,
  deleteIssue
} = require("../controllers/issueController");

router.post("/", verifyToken, createIssue);

router.get("/", verifyToken, getIssues);

router.put("/:id/assign",
  verifyToken,
  allowRoles("manager"),
  assignIssue
);

router.put("/:id/status",
  verifyToken,
  updateStatus
);

router.delete("/:id",
  verifyToken,
  allowRoles("admin"),
  deleteIssue
);

module.exports = router;
