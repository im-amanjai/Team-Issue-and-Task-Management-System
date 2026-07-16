const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/pdf", "text/plain", "text/csv",
    "application/json", "application/zip", "application/x-zip-compressed",
  ];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/", verifyToken, upload.array("files", 5), createIssue);
router.get("/", verifyToken, getIssues);
router.get("/:id", verifyToken, getIssueById);
router.patch("/:id", verifyToken, updateIssue);
router.patch("/:id/assign", verifyToken, allowRoles("admin", "manager"), assignIssue);
router.patch("/:id/status", verifyToken, updateStatus);
router.delete("/:id", verifyToken, allowRoles("admin", "manager"), deleteIssue);

module.exports = router;
