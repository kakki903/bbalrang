const express = require("express");
const { listBoards } = require("../controllers/boardController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, listBoards);

module.exports = router;
