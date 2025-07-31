import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import Link from "next/link";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardId, setBoardId] = useState("");
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await api.get("/boards");
        setBoards(res.data.boards);
        if (res.data.boards.length > 0) {
          setBoardId(res.data.boards[0].id.toString());
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoards();
  }, []);

  useEffect(() => {
    if (!boardId) return;
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await api.get("/posts", { params: { boardId } });
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [boardId]);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">게시글 목록</h2>

      <div className="mb-4">
        <label
          htmlFor="board-select"
          className="mr-2 font-semibold text-gray-700"
        >
          게시판 선택:{" "}
        </label>
        <select
          id="board-select"
          value={boardId}
          onChange={(e) => setBoardId(e.target.value)}
          className="border rounded px-3 py-1"
        >
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.topic} ({board.age}세)
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <Link href={`/posts/${post.id}`}>
                <a className="text-indigo-600 font-bold text-lg">
                  {post.title}
                </a>
              </Link>
              <p className="text-gray-700 truncate">{post.content}</p>
              <div className="text-sm text-gray-500 mt-1">
                작성자 ID: {post.userId}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link href="/posts/new">
          <a className="inline-block bg-indigo-600 text-white rounded px-6 py-2 hover:bg-indigo-700 transition">
            새 게시글 작성
          </a>
        </Link>
      </div>
    </Layout>
  );
}
