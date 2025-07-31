const request = require("supertest");
const app = require("../src/app");

describe("Subscription API", () => {
  let token = "";

  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });
    token = loginRes.body.token;
  });

  it("should subscribe with valid age range", async () => {
    const res = await request(app)
      .post("/api/subscriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({ minAge: 18, maxAge: 25 });
    expect(res.statusCode).toBe(201);
    expect(res.body.subscription).toHaveProperty("id");
  });

  it("should get active subscription", async () => {
    const res = await request(app)
      .get("/api/subscriptions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.subscription).toHaveProperty("id");
  });

  it("should cancel subscription", async () => {
    const res = await request(app)
      .delete("/api/subscriptions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/canceled/i);
  });
});
