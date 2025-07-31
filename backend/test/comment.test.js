const request = require("supertest");
const app = require("../src/app");

describe("Comment API", () => {
  let token = "";
  let createdPostId = null;
  let createdCommentId = null;
  let boardId = null;

  beforeAll(async () => {
    // 로그인
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });
    token = loginRes.body.token;

    // 게시판 ID와 게시글 생성
    const boardsRes = await request(app)
      .get("/api/boards")
      .set("Authorization", `Bearer ${token}`);
    boardId = boardsRes.body.boards[0].id;

    const postRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        boardId,
        title: "Comment Test Post",
        content: "Content for comment test",
      });
    createdPostId = postRes.body.post.id;
  });

  it("should create a comment", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        postId: createdPostId,
        content: "This is a test comment",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toHaveProperty("id");
    createdCommentId = res.body.comment.id;
  });

  it("should list comments by postId", async () => {
    const res = await request(app)
      .get("/api/comments")
      .set("Authorization", `Bearer ${token}`)
      .query({ postId: createdPostId });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments.some((c) => c.id === createdCommentId)).toBe(true);
  });

  it("should delete the comment", async () => {
    const res = await request(app)
      .delete(`/api/comments/${createdCommentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
