const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getLogsByIssue } = require("../controllers/activityLogController");

router.get("/issue/:issueId", verifyToken, getLogsByIssue);

module.exports = router;
