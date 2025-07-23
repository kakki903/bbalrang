const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

// GET /api/users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// POST /api/users
router.post("/", async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({
    data: { email, name },
  });
  res.status(201).json(user);
});

module.exports = router;
