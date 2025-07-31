import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import api from "../../utils/api";

export default function MessageDetail() {
  const router = useRouter();
  const { withUserId } = router.query;
  const [messages, setMessages] = useState([]);
  const [inputContent, setInputContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMessages() {
    if (!withUserId) return;
    setLoading(true);
    try {
      const res = await api.get("/messages", {
        params: { withUserId: Number(withUserId) },
      });
      setMessages(res.data.messages);

      // 읽지 않은 메세지 읽음 처리
      for (const msg of res.data.messages) {
        if (!msg.read && msg.receiverId === getCurrentUserId()) {
          await api.put(`/messages/${msg.id}/read`);
        }
      }
    } catch (err) {
      console.error(err);
      setError("메시지 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [withUserId]);

  function getCurrentUserId() {
    // JWT 디코딩으로 현재 로그인 유저 ID 가져오기 혹은 Context에서 관리
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch {
      return null;
    }
  }

  async function sendMessage() {
    if (!inputContent.trim()) {
      setError("메시지를 입력하세요.");
      return;
    }
    setError("");
    try {
      await api.post("/messages", {
        receiverId: Number(withUserId),
        content: inputContent,
      });
      setInputContent("");
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "메시지 전송 실패");
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">
        쪽지 상대방 ID: {withUserId}
      </h2>

      <div className="max-h-80 overflow-y-auto p-4 border rounded bg-white mb-6">
        {loading ? (
          <p>로딩중...</p>
        ) : messages.length === 0 ? (
          <p>메시지가 없습니다.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded ${
                msg.senderId === getCurrentUserId()
                  ? "bg-indigo-100 self-end"
                  : "bg-gray-100 self-start"
              }`}
              style={{
                maxWidth: "60%",
                marginLeft: msg.senderId === getCurrentUserId() ? "auto" : "0",
              }}
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
