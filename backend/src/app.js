const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const boardRoutes = require("./routes/boardRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reportRoutes = require("./routes/reportRoutes");
const blockRoutes = require("./routes/blockRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors()); // CORS 활성화
app.use(morgan("dev")); // 요청 로깅
app.use(express.json()); // JSON 바디 파서

// 라우트 등록
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// 404 처리
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// 에러 핸들러 미들웨어
app.use(errorMiddleware);

module.exports = app;
