// prisma/seed.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "hashed_password",
      nickname: "testuser",
      provider: "EMAIL",
      isEmailVerified: true,
      grade: "BASIC",
    },
  });

  await prisma.admin.create({
    data: {
      email: "admin@example.com",
      password: "hashed_admin_pw",
      name: "슈퍼관리자",
      role: "SUPER",
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
