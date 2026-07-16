const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
  uploadAttachment,
  getAttachmentsByIssue,
  downloadFile,
  deleteAttachment,
} = require("../controllers/attachmentController");

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
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/json",
    "application/zip",
    "application/x-zip-compressed",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/:issueId",
  verifyToken,
  upload.single("file"),
  uploadAttachment
);
router.get("/issue/:issueId", verifyToken, getAttachmentsByIssue);
router.get("/file/:filename", downloadFile);
router.delete("/:id", verifyToken, deleteAttachment);

module.exports = router;
