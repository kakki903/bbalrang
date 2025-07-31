const express = require("express");
const {
  listMessages,
  sendMessage,
  readMessage,
} = require("../controllers/messageController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, listMessages); // ?withUserId=상대방ID
router.post("/", authenticateToken, sendMessage);
router.put("/:messageId/read", authenticateToken, readMessage);

module.exports = router;
