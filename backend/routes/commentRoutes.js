const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  addComment,
  getCommentsByIssue,
  deleteComment
} = require("../controllers/commentController");

// Add comment
router.post(
  "/",
  verifyToken,
  addComment
);

// get comments for issue
router.get(
  "/:issueId",
  verifyToken,
  getCommentsByIssue
);

// Delete comment (Admin only)
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  deleteComment
);

module.exports = router;
