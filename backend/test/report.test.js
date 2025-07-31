const request = require("supertest");
const app = require("../src/app");

describe("Report API", () => {
  let token = "";

  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });
    token = loginRes.body.token;
  });

  it("should create a report", async () => {
    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${token}`)
      .send({
        targetType: "post",
        targetId: 1,
        reason: "Test report reason",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.report).toHaveProperty("id");
  });

  it("should list recent reports", async () => {
    const res = await request(app)
      .get("/api/reports")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.reports)).toBe(true);
  });
});
