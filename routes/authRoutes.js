const express = require("express");
const { signup, login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/signup", verifyToken, allowRoles("admin"), signup); 
// only admin can create users

router.post("/login", login);

module.exports = router;
