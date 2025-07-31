const prisma = require("../config/database");

async function listMessages(req, res) {
  try {
    const userId = req.user.userId;
    const withUserId = Number(req.query.withUserId);
    if (!withUserId)
      return res.status(400).json({ message: "withUserId required" });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: withUserId },
          { senderId: withUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function sendMessage(req, res) {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;
    if (!receiverId || !content)
      return res.status(400).json({ message: "Missing fields" });

    // 차단 여부 체크 (block 테이블)
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedUserId: receiverId },
          { blockerId: receiverId, blockedUserId: senderId },
        ],
      },
    });

    if (block)
      return res
        .status(403)
        .json({ message: "Message blocked by block settings" });

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: Number(receiverId),
        content,
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function readMessage(req, res) {
  try {
    const userId = req.user.userId;
    const messageId = Number(req.params.messageId);

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.receiverId !== userId)
      return res.status(403).json({ message: "Not authorized" });

    if (message.read) return res.json({ message: "Already read" });

    await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });

    res.json({ message: "Message marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listMessages,
  sendMessage,
  readMessage,
};
