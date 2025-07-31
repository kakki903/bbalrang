const express = require("express");
const {
  subscribe,
  getSubscription,
  cancelSubscription,
} = require("../controllers/subscriptionController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, subscribe);
router.get("/", authenticateToken, getSubscription);
router.delete("/", authenticateToken, cancelSubscription);

module.exports = router;
