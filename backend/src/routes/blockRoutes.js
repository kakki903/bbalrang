const express = require("express");
const {
  blockUser,
  unblockUser,
  listBlocks,
} = require("../controllers/blockController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:blockedUserId", authenticateToken, blockUser);
router.delete("/:blockedUserId", authenticateToken, unblockUser);
router.get("/", authenticateToken, listBlocks);

module.exports = router;
