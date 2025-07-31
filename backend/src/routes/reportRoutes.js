const express = require("express");
const {
  createReport,
  listReports,
} = require("../controllers/reportController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createReport);
router.get("/", authenticateToken, listReports);

module.exports = router;
