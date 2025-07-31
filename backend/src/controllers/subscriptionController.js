const prisma = require("../config/database");

async function subscribe(req, res) {
  try {
    const userId = req.user.userId;
    const { minAge, maxAge, endedAt } = req.body;

    if (typeof minAge !== "number" || typeof maxAge !== "number") {
      return res
        .status(400)
        .json({ message: "minAge and maxAge must be numbers" });
    }
    if (minAge > maxAge)
      return res
        .status(400)
        .json({ message: "minAge cannot be greater than maxAge" });

    // 기존 구독 만료 처리 (optional)
    await prisma.subscription.updateMany({
      where: { userId, endedAt: null },
      data: { endedAt: new Date() },
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        minAge,
        maxAge,
        startedAt: new Date(),
        endedAt: null,
      },
    });

    res.status(201).json({ subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getSubscription(req, res) {
  try {
    const userId = req.user.userId;
    const subscription = await prisma.subscription.findFirst({
      where: { userId, endedAt: null },
    });
    if (!subscription)
      return res.status(404).json({ message: "No active subscription found" });

    res.json({ subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function cancelSubscription(req, res) {
  try {
    const userId = req.user.userId;
    const result = await prisma.subscription.updateMany({
      where: { userId, endedAt: null },
      data: { endedAt: new Date() },
    });

    if (result.count === 0)
      return res
        .status(404)
        .json({ message: "No active subscription to cancel" });

    res.json({ message: "Subscription canceled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  subscribe,
  getSubscription,
  cancelSubscription,
};
