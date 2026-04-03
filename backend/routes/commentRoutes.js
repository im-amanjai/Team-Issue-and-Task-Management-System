const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  addComment,
  getCommentsByIssue,
  deleteComment,
} = require("../controllers/commentController");

router.post("/", verifyToken, addComment);
router.get("/issue/:issueId", verifyToken, getCommentsByIssue);
router.delete("/:id", verifyToken, allowRoles("admin"), deleteComment);

module.exports = router;
