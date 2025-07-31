const prisma = require("../config/database");

async function blockUser(req, res) {
  try {
    const blockerId = req.user.userId;
    const blockedUserId = Number(req.params.blockedUserId);

    if (blockerId === blockedUserId)
      return res.status(400).json({ message: "Cannot block yourself" });

    // 중복 차단 체크
    const existingBlock = await prisma.block.findFirst({
      where: { blockerId, blockedUserId },
    });
    if (existingBlock)
      return res.status(400).json({ message: "Already blocked" });

    const block = await prisma.block.create({
      data: { blockerId, blockedUserId },
    });

    res.status(201).json({ block });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function unblockUser(req, res) {
  try {
    const blockerId = req.user.userId;
    const blockedUserId = Number(req.params.blockedUserId);

    const deleted = await prisma.block.deleteMany({
      where: { blockerId, blockedUserId },
    });

    res.json({ message: "Unblocked", deletedCount: deleted.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function listBlocks(req, res) {
  try {
    const blockerId = req.user.userId;
    const blocks = await prisma.block.findMany({
      where: { blockerId },
      include: {
        blockedUser: {
          select: { id: true, nickname: true, email: true },
        },
      },
    });
    res.json({ blocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  blockUser,
  unblockUser,
  listBlocks,
};
