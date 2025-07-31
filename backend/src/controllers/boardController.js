const prisma = require("../config/database");

async function listBoards(req, res) {
  try {
    const userAge = req.user.age;
    const topic = req.query.topic;

    const where = { age: userAge };
    if (topic) where.topic = topic;

    const boards = await prisma.board.findMany({ where });

    res.json({ boards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { listBoards };
