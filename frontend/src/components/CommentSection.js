import { useState, useEffect } from "react";
import api from "../utils/api";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 댓글 불러오기
  useEffect(() => {
    if (!postId) return;
    async function fetchComments() {
      setLoading(true);
      try {
        const res = await api.get("/comments", { params: { postId } });
        setComments(res.data.comments);
      } catch (err) {
        console.error(err);
        setError("댓글 로딩 실패");
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  // 댓글 작성
  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) {
      setError("댓글 내용을 입력하세요.");
      return;
    }
    setError("");
    try {
      await api.post("/comments", { postId: Number(postId), content: input });
      setInput("");
      // 댓글 다시 불러오기
      const res = await api.get("/comments", { params: { postId } });
      setComments(res.data.comments);
    } catch (err) {
      setError(err.response?.data?.message || "댓글 작성 실패");
    }
  }

  // 댓글 삭제
  async function handleDelete(commentId) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "댓글 삭제 실패");
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">댓글</h3>
      {loading && <p>댓글 로딩중...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <ul className="space-y-3 max-h-64 overflow-y-auto mb-4">
        {comments.length === 0 && <li>댓글이 없습니다.</li>}
        {comments.map((comment) => (
          <li key={comment.id} className="bg-gray-100 p-3 rounded">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold">
                {comment.authorNickname || `사용자 ${comment.userId}`}
              </p>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => handleDelete(comment.id)}
              >
                삭제
              </button>
            </div>
            <p className="whitespace-pre-wrap">{comment.content}</p>
            <small className="text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition"
        >
          등록
        </button>
      </form>
    </div>
  );
}
