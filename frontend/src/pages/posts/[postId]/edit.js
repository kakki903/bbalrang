import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import api from "../../../utils/api";

export default function EditPost() {
  const router = useRouter();
  const { postId } = router.query;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await api.get(`/posts/${postId}`);
        setTitle(res.data.post.title);
        setContent(res.data.post.content);
      } catch (err) {
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    if (!title || !content) {
      setError("제목과 내용을 모두 입력하세요.");
      return;
    }
    try {
      await api.put(`/posts/${postId}`, { title, content });
      router.push(`/posts/${postId}`);
    } catch (err) {
      setError(err.response?.data?.message || "수정 실패");
    }
  }

  async function handleDelete() {
    if (!confirm("정말 게시글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      router.push("/posts");
    } catch (err) {
      alert(err.response?.data?.message || "삭제 실패");
    }
  }

  if (loading) return <Layout>로딩중...</Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">게시글 수정</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleUpdate}
        className="max-w-lg bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            required
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded px-6 py-2 hover:bg-indigo-700 transition"
          >
            저장
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white rounded px-6 py-2 hover:bg-red-700 transition"
          >
            삭제
          </button>
        </div>
      </form>
    </Layout>
  );
}
