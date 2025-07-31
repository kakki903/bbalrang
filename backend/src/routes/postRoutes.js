const express = require("express");
const {
  listPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, listPosts);
router.post("/", authenticateToken, createPost);
router.get("/:postId", authenticateToken, getPost);
router.put("/:postId", authenticateToken, updatePost);
router.delete("/:postId", authenticateToken, deletePost);

module.exports = router;
