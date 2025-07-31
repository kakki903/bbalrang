const prisma = require("../config/database");

async function listComments(req, res) {
  try {
    const { postId } = req.query;
    if (!postId) return res.status(400).json({ message: "postId required" });

    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      orderBy: { createdAt: "asc" },
    });
    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createComment(req, res) {
  try {
    const userId = req.user.userId;
    const { postId, content } = req.body;
    if (!postId || !content)
      return res.status(400).json({ message: "Missing fields" });

    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        userId,
        content,
      },
    });
    res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteComment(req, res) {
  try {
    const userId = req.user.userId;
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await prisma.comment.delete({ where: { id: Number(commentId) } });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listComments,
  createComment,
  deleteComment,
};
