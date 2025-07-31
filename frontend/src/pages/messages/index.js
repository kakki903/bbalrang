import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";

export default function Messages() {
  const [withUserId, setWithUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputContent, setInputContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!withUserId) return;
    async function fetchMessages() {
      setLoading(true);
      try {
        const res = await api.get("/messages", {
          params: { withUserId: Number(withUserId) },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [withUserId]);

  async function sendMessage() {
    if (!withUserId || !inputContent.trim()) {
      setError("대상과 메시지를 모두 입력해주세요.");
      return;
    }
    setError("");
    try {
      await api.post("/messages", {
        receiverId: Number(withUserId),
        content: inputContent,
      });
      setInputContent("");
      // 메시지 새로 불러오기
      const res = await api.get("/messages", {
        params: { withUserId: Number(withUserId) },
      });
      setMessages(res.data.messages);
    } catch (err) {
      setError(err.response?.data?.message || "메시지 전송 실패");
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">1:1 쪽지</h2>

      <div className="mb-4">
        <input
          type="number"
          placeholder="상대방 사용자 ID 입력"
          value={withUserId}
          onChange={(e) => setWithUserId(e.target.value)}
          className="border rounded px-3 py-2 w-48"
        />
        <button
          onClick={() => setWithUserId("")}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          초기화
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto mb-4 border rounded p-4 bg-white">
        {loading ? (
          <p>로딩 중...</p>
        ) : messages.length === 0 ? (
          <p>메시지가 없습니다.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded ${
                msg.senderId === null ? "bg-indigo-100" : "bg-gray-100"
              }`}
            >
              <p>{msg.content}</p>
              <small className="text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="메시지 입력"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition"
        >
          전송
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </Layout>
  );
}
