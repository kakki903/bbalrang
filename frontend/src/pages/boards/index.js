import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await api.get("/boards");
        setBoards(res.data.boards);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  if (loading) return <Layout>로딩중...</Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-5">게시판 목록</h2>
      <ul className="space-y-4">
        {boards.map((board) => (
          <li
            key={board.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="font-bold text-indigo-600">{board.topic}</div>
            <div className="text-gray-600">나이 그룹: {board.age}세</div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
