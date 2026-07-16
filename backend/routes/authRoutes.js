const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC ROUTES
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// PROTECTED ROUTES
router.patch("/profile", verifyToken, updateProfile);

module.exports = router;
