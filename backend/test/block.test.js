const request = require("supertest");
const app = require("../src/app");

describe("Block API", () => {
  let token = "";
  let blockedUserId = null;

  beforeAll(async () => {
    // 로그인
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });
    token = loginRes.body.token;

    // 테스트용 유저 생성 및 아이디 획득 (차단 대상)
    const otherUser = {
      email: "blocktarget@example.com",
      password: "password123",
      birthDate: "1995-01-01",
      nickname: "BlockTarget",
      phone: "01022223333",
    };

    try {
      await request(app).post("/api/auth/signup").send(otherUser);
    } catch (e) {} // 이미 존재해도 무시

    const loginOther = await request(app).post("/api/auth/login").send({
      email: otherUser.email,
      password: otherUser.password,
    });

    const decoded = require("jsonwebtoken").decode(loginOther.body.token);
    blockedUserId = decoded.userId;
  });

  it("should block a user", async () => {
    const res = await request(app)
      .post(`/api/blocks/${blockedUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.block).toHaveProperty("id");
  });

  it("should list blocked users", async () => {
    const res = await request(app)
      .get("/api/blocks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.blocks)).toBe(true);
    expect(
      res.body.blocks.some((b) => b.blockedUser.id === blockedUserId)
    ).toBe(true);
  });

  it("should unblock a user", async () => {
    const res = await request(app)
      .delete(`/api/blocks/${blockedUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/unblocked/i);
  });
});
