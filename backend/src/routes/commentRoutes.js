const express = require("express");
const {
  createComment,
  listComments,
  deleteComment,
} = require("../controllers/commentController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, listComments); // 쿼리: ?postId=숫자
router.post("/", authenticateToken, createComment);
router.delete("/:commentId", authenticateToken, deleteComment);

module.exports = router;
