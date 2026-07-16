const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");
const {
  uploadAttachment,
  getAttachmentsByIssue,
  deleteAttachment,
} = require("../controllers/attachmentController");

router.post(
  "/:issueId",
  verifyToken,
  upload.single("file"),
  uploadAttachment
);
router.get("/issue/:issueId", verifyToken, getAttachmentsByIssue);
router.delete("/:id", verifyToken, deleteAttachment);

module.exports = router;
