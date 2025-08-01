// /src/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS 설정 (프론트엔드와의 연동을 위한 필수 설정)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ✅ JSON Body 파싱 미들웨어
app.use(express.json());

// ✅ 사용자 관련 라우트 연결
app.use("/api/users", userRoutes);

// ✅ 소셜 로그인 관련 라우트 연결
app.use("/api/oauth", oauthRoutes);

// ✅ 존재하지 않는 라우트 처리 (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;
