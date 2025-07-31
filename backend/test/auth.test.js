const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {
  const testUser = {
    email: "testuser@example.com",
    password: "password123",
    nickname: "tester",
    birthDate: "2000-01-01",
    phone: "01012345678",
    socialId: null,
    gender: "male",
  };

  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
  });

  it("should not sign up user with duplicate email", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it("should login the user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpassword" });
    expect(res.statusCode).toBe(400);
  });
});
