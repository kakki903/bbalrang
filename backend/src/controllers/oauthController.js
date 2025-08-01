import prisma from "../../prisma/client.js";
import jwt from "jsonwebtoken";
import {
  getGoogleUserInfo,
  getKakaoUserInfo,
} from "../services/oauthService.js";
export const test = async (req, res) => {
  res.status(200).json({ test: "test" });
};
export const handleGoogleLogin = async (req, res) => {
  const { accessToken } = req.body;

  // 1. 구글에서 사용자 정보 받아오기
  const googleUser = await getGoogleUserInfo(accessToken);
  const { id: providerId, email, name } = googleUser;

  // 2. 기존 OAuthAccount 확인
  const existingOAuth = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerId: {
        provider: "google",
        providerId,
      },
    },
    include: { user: true },
  });

  let user;

  if (existingOAuth) {
    // 기존 연결된 유저
    user = existingOAuth.user;
  } else {
    // 3. 같은 이메일로 가입한 사용자 있는지 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // 이메일로 기존 유저에 연결
      user = existingUser;
    } else {
      // 4. 새 유저 생성
      user = await prisma.user.create({
        data: {
          email,
          nickname: `user_${Math.floor(Math.random() * 100000)}`,
          provider: "GOOGLE",
          isEmailVerified: true,
        },
      });
    }

    // 5. OAuthAccount 저장
    await prisma.oAuthAccount.create({
      data: {
        provider: "google",
        providerId,
        userId: user.id,
      },
    });
  }

  // 6. 토큰 발급 + 세션 기록
  const token = jwt.sign(
    { userId: user.id, nickname: user.nickname },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      expiredAt: new Date(Date.now() + 3600000),
    },
  });

  res.status(200).json({ token });
};

export const handleKakaoLogin = async (req, res) => {
  const { accessToken } = req.body;

  // 1. Kakao에서 사용자 정보 받아오기
  const kakaoUser = await getKakaoUserInfo(accessToken);
  const { providerId, email, nickname } = kakaoUser;

  if (!email) {
    return res
      .status(400)
      .json({ message: "이메일을 제공하지 않은 Kakao 계정입니다." });
  }

  // 2. 기존 OAuthAccount 확인
  const existingOAuth = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerId: {
        provider: "kakao",
        providerId,
      },
    },
    include: { user: true },
  });

  let user;

  if (existingOAuth) {
    // 기존 연결된 유저
    user = existingOAuth.user;
  } else {
    // 3. 같은 이메일로 가입된 유저 있는지 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      user = existingUser;
    } else {
      // 4. 신규 유저 생성
      user = await prisma.user.create({
        data: {
          email,
          nickname: `kakao_${Math.floor(Math.random() * 100000)}`,
          provider: "KAKAO",
          isEmailVerified: true,
        },
      });
    }

    // 5. OAuth 계정 등록
    await prisma.oAuthAccount.create({
      data: {
        provider: "kakao",
        providerId,
        userId: user.id,
      },
    });
  }

  // 6. JWT 발급
  const token = jwt.sign(
    { userId: user.id, nickname: user.nickname },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 7. 세션 저장
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      expiredAt: new Date(Date.now() + 3600000),
    },
  });

  res.status(200).json({ token });
};
