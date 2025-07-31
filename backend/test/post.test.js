const request = require("supertest");
const app = require("../src/app");

describe("Post API", () => {
  let token = "";
  let createdPostId = null;
  let boardId = null; // 테스트용 게시판 ID

  beforeAll(async () => {
    // 로그인 토큰 받기
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });
    token = loginRes.body.token;

    // 테스트용 게시판 가져오기 (게시판이 없으면 테스트 실패 가능)
    const boardsRes = await request(app)
      .get("/api/boards")
      .set("Authorization", `Bearer ${token}`);
    expect(boardsRes.statusCode).toBe(200);
    expect(boardsRes.body.boards.length).toBeGreaterThan(0);

    boardId = boardsRes.body.boards[0].id;
  });

  it("should create a post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        boardId,
        title: "Test Post Title",
        content: "Test Post Content",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.post).toHaveProperty("id");
    createdPostId = res.body.post.id;
  });

  it("should get the post by id", async () => {
    const res = await request(app)
      .get(`/api/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.post.id).toBe(createdPostId);
  });

  it("should update the post", async () => {
    const res = await request(app)
      .put(`/api/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        content: "Updated Content",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.post.title).toBe("Updated Title");
  });

  it("should delete the post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
