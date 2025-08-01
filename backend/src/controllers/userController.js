// controllers/userController.js
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../services/emailService.js";

// 회원가입
export const registerUser = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // 1. 중복 이메일/닉네임 확인
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    const existingNickname = await prisma.user.findUnique({
      where: { nickname },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    }

    if (existingNickname) {
      return res.status(400).json({ message: "이미 사용 중인 닉네임입니다." });
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 유저 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        isEmailVerified: false,
        provider: "EMAIL",
      },
    });

    // 4. 인증 코드 이메일 발송
    await sendVerificationEmail(email);

    // 5. 응답 전송
    return res.status(201).json({
      message: "회원가입 완료. 인증 코드를 이메일로 전송했습니다.",
    });
  } catch (err) {
    console.error("❌ 회원가입 중 에러 발생:", err);

    return res.status(500).json({
      message: "회원가입 중 서버 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

// 이메일 인증
export const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  // 1. 인증코드 조회
  const record = await prisma.emailVerification.findFirst({
    where: {
      email,
      code,
      expiresAt: { gt: new Date() },
      isVerified: false,
    },
  });

  if (!record) {
    return res
      .status(400)
      .json({ message: "인증 코드가 유효하지 않거나 만료되었습니다." });
  }

  // 2. 인증 코드 상태 업데이트
  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { isVerified: true },
  });

  // 3. 사용자 이메일 인증 완료 처리
  await prisma.user.update({
    where: { email },
    data: { isEmailVerified: true },
  });

  res.status(200).json({ message: "이메일 인증이 완료되었습니다." });
};

// 로그인 처리
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. 사용자 찾기
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(404).json({ message: "존재하지 않는 계정입니다." });

  // 2. 이메일 인증 여부 확인
  if (!user.isEmailVerified) {
    return res
      .status(401)
      .json({ message: "이메일 인증이 완료되지 않았습니다." });
  }

  // 3. 비밀번호 비교
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  // 4. Access Token 발급
  const token = jwt.sign(
    { userId: user.id, nickname: user.nickname },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // 유효기간은 상황에 맞게 조절
  );

  // 5. 세션 기록 저장
  const userAgent = req.headers["user-agent"] || "unknown";
  const ip = req.ip || req.connection.remoteAddress;
  const expiredAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      ip,
      userAgent,
      expiredAt,
    },
  });

  // 6. 마지막 로그인 업데이트
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // 7. 응답
  res.status(200).json({ token });
};

export const completeUserProfile = async (req, res) => {
  const { nickname, birth } = req.body;
  const userId = req.user.userId; // JWT 인증 미들웨어로부터

  // 닉네임 중복 체크
  const exists = await prisma.user.findFirst({
    where: {
      nickname,
      id: { not: userId },
    },
  });
  if (exists) {
    return res.status(400).json({ message: "이미 사용 중인 닉네임입니다." });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      nickname,
      isProfileComplete: true,
      // 추가 필드: 생일, 성별 등 확장 가능
    },
  });

  res.status(200).json({ message: "프로필이 정상적으로 저장되었습니다." });
};

export const getMyProfile = async (req, res) => {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      nickname: true,
      isProfileComplete: true,
      provider: true,
      grade: true,
    },
  });

  res.status(200).json(user);
};
