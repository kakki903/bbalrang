const prisma = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { calculateAge } = require("../utils/dateUtils");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// 회원가입
async function signup(req, res) {
  try {
    const { email, password, nickname, birthDate, phone, socialId, gender } =
      req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    // 중복 이메일 체크 (선행 검사)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (!birthDate)
      return res.status(400).json({ message: "Birth date required" });
    const age = calculateAge(birthDate);

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname,
        age,
        phone,
        socialId,
        gender,
      },
    });

    return res
      .status(201)
      .json({ message: "User registered", userId: user.id });
  } catch (error) {
    console.error(error);

    // Prisma 고유 제약 위반 에러 처리 (PostgreSQL unique constraint)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" // unique constraint violation 코드
    ) {
      return res
        .status(409)
        .json({ message: "Duplicate value violates unique constraint" });
    }

    // 기타 서버 에러
    return res.status(500).json({ message: "Server error" });
  }
}

// 로그인
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.passwordHash) {
      return res.status(400).json({ message: "Please use social login" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // JWT 생성, payload에 userId, email, age 포함
    const token = jwt.sign(
      { userId: user.id, email: user.email, age: user.age },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  signup,
  login,
};
