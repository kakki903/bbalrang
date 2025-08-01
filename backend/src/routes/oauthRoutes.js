// routes/oauthRoutes.js

import express from "express";
import {
  handleGoogleLogin,
  handleKakaoLogin,
  test,
} from "../controllers/oauthController.js";

const router = express.Router();

router.post("/google", handleGoogleLogin);
router.post("/kakao", handleKakaoLogin);
router.get("/test", test);

export default router;
