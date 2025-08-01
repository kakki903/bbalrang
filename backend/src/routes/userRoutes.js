import express from "express";
import {
  registerUser,
  verifyEmailCode,
  loginUser,
  completeUserProfile,
  getMyProfile,
} from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmailCode);
router.post("/login", loginUser);
router.get("/me", authenticateUser, getMyProfile);
router.post("/complete-profile", authenticateUser, completeUserProfile);

export default router;
