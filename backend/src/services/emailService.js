// services/emailService.js

import prisma from "../../prisma/client.js";
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email) => {
  // 1. 코드 생성 (6자리 숫자)
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. 유효시간 설정 (10분)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 3. 기존 인증 기록 제거
  await prisma.emailVerification.deleteMany({ where: { email } });

  // 4. DB에 인증 코드 저장
  await prisma.emailVerification.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  // 5. 이메일 발송
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "이메일 인증 코드",
    text: `인증 코드는 ${code} 입니다. 10분 내로 입력해주세요.`,
  });
};
