const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  getUsers,
  getAssignableUsers,
  createUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

router.get("/assignable", verifyToken, allowRoles("admin", "manager"), getAssignableUsers);
router.get("/", verifyToken, allowRoles("admin", "manager"), getUsers);
router.post("/", verifyToken, allowRoles("admin"), createUser);
router.patch("/:id/role", verifyToken, allowRoles("admin"), updateUserRole);
router.delete("/:id", verifyToken, allowRoles("admin"), deleteUser);

module.exports = router;
