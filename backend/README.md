# 1. .env 의 DATABASE_URL 맞춰놓기

# 2. 마이그레이션 및 DB 반영

npx prisma migrate dev --name init

# 3. Prisma Client 생성 (생략 가능)

npx prisma generate

# 4. (선택) Prisma Studio로 데이터 보기

npx prisma studio
