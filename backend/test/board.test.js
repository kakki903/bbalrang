const request = require("supertest");
const app = require("../src/app");

describe("Board API", () => {
  let token = "";

  beforeAll(async () => {
    // 로그인 및 토큰 획득
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });
    token = loginRes.body.token;
  });

  it("should return list of boards for authenticated user", async () => {
    const res = await request(app)
      .get("/api/boards")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.boards)).toBe(true);
  });

  it("should filter boards by topic", async () => {
    const res = await request(app)
      .get("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .query({ topic: "연애" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.boards)).toBe(true);
    res.body.boards.forEach((board) => {
      expect(board.topic).toBe("연애");
    });
  });
});
