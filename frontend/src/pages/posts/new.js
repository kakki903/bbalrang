import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import { useRouter } from "next/router";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardId, setBoardId] = useState("");
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await api.get("/boards");
        setBoards(res.data.boards);
        if (res.data.boards.length > 0)
          setBoardId(res.data.boards[0].id.toString());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoards();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title || !content || !boardId) {
      setError("모든 항목을 채워주세요.");
      return;
    }
    try {
      await api.post("/posts", { title, content, boardId: Number(boardId) });
      router.push("/posts");
    } catch (err) {
      setError(err.response?.data?.message || "게시글 작성 실패");
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">새 게시글 작성</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label htmlFor="board-select" className="block font-semibold mb-1">
            게시판
          </label>
          <select
            id="board-select"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.topic} ({board.age}세)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            제목
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="게시글 제목 입력"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block font-semibold mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full border rounded px-3 py-2"
            placeholder="게시글 내용을 입력하세요"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded px-6 py-2 hover:bg-indigo-700 transition"
        >
          작성 완료
        </button>
      </form>
    </Layout>
  );
}
