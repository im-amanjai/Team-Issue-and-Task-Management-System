const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/my", verifyToken, getMyNotifications);
router.patch("/:id/read", verifyToken, markAsRead);

module.exports = router;
