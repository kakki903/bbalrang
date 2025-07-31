const request = require("supertest");
const app = require("../src/app");

describe("Message API", () => {
  let token = "";
  let otherUserToken = "";
  let otherUserId = null;
  let messageId = null;

  const testUser = { email: "testuser@example.com", password: "password123" };
  const otherUser = {
    email: "otheruser@example.com",
    password: "password123",
    birthDate: "1990-01-01",
  };

  beforeAll(async () => {
    // testUser 로그인
    const loginRes = await request(app).post("/api/auth/login").send(testUser);
    token = loginRes.body.token;

    // 다른 유저가 없으면 만듬 (실제 운영 시에는 별도 fixture 데이터 필요)
    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send({ ...otherUser, nickname: "Other", phone: "01011112222" });

    // 다른 유저 로그인
    const otherLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: otherUser.email, password: otherUser.password });
    otherUserToken = otherLoginRes.body.token;

    // 다른 유저 아이디 조회 (JWT payload에는 id 포함되어야 함)
    const decoded = require("jsonwebtoken").decode(otherUserToken);
    otherUserId = decoded.userId;
  });

  it("should send a message to another user", async () => {
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({
        receiverId: otherUserId,
        content: "Hello from testuser",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toHaveProperty("id");
    messageId = res.body.message.id;
  });

  it("should list messages between users", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .query({ withUserId: otherUserId });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.messages)).toBe(true);
  });

  it("should mark message as read", async () => {
    const res = await request(app)
      .put(`/api/messages/${messageId}/read`)
      .set("Authorization", `Bearer ${otherUserToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/marked as read/i);
  });
});
