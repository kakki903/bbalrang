// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "인증 토큰이 없습니다." });

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 이후 컨트롤러에서 req.user.userId 사용 가능
    next();
  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
