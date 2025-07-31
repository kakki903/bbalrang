const prisma = require("../config/database");

async function createReport(req, res) {
  try {
    const reporterId = req.user.userId;
    const { targetType, targetId, reason } = req.body;

    if (!targetType || !targetId || !reason)
      return res.status(400).json({ message: "Missing fields" });

    const report = await prisma.report.create({
      data: {
        reporterId,
        targetType,
        targetId: Number(targetId),
        reason,
      },
    });
    res.status(201).json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function listReports(req, res) {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // 최근 50건
    });
    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createReport, listReports };
