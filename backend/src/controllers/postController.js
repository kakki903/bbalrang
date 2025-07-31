const prisma = require("../config/database");

// 본인 나이+주제 게시판 범위 내 게시글 조회
async function listPosts(req, res) {
  try {
    const userAge = req.user.age;
    const { boardId } = req.query;

    if (!boardId)
      return res.status(400).json({ message: "boardId query missing" });

    // 게시판이 본인 나이+주제에 맞는지 확인
    const board = await prisma.board.findUnique({
      where: { id: parseInt(boardId) },
    });
    if (!board || board.age !== userAge) {
      return res.status(403).json({ message: "Access denied to this board" });
    }

    const posts = await prisma.post.findMany({
      where: { boardId: parseInt(boardId) },
      orderBy: { createdAt: "desc" },
    });

    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// 게시글 작성
async function createPost(req, res) {
  try {
    const userAge = req.user.age;
    const userId = req.user.userId;
    const { boardId, title, content } = req.body;

    if (!boardId || !title || !content)
      return res.status(400).json({ message: "Missing fields" });

    // 게시판 접근 권한 확인
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
    });
    if (!board || board.age !== userAge) {
      return res
        .status(403)
        .json({ message: "No permission to post on this board" });
    }

    const post = await prisma.post.create({
      data: {
        boardId: Number(boardId),
        userId,
        title,
        content,
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// 게시글 단건 조회
async function getPost(req, res) {
  try {
    const userAge = req.user.age;
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: { board: true, author: true },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.board.age !== userAge)
      return res.status(403).json({ message: "Access denied" });

    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// 게시글 수정 (작성자만)
async function updatePost(req, res) {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;
    const { title, content } = req.body;

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId !== userId)
      return res.status(403).json({ message: "No permission to edit" });

    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: { title, content },
    });

    res.json({ post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// 게시글 삭제 (작성자만)
async function deletePost(req, res) {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId !== userId)
      return res.status(403).json({ message: "No permission to delete" });

    await prisma.post.delete({ where: { id: Number(postId) } });

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};
