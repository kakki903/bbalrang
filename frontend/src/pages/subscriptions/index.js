import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";

export default function Subscriptions() {
  const [subscription, setSubscription] = useState(null);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSubscription() {
      setLoading(true);
      try {
        const res = await api.get("/subscriptions");
        setSubscription(res.data.subscription);
        if (res.data.subscription) {
          setMinAge(res.data.subscription.minAge);
          setMaxAge(res.data.subscription.maxAge);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, []);

  async function handleSubscribe() {
    setError("");
    setMessage("");
    if (!minAge || !maxAge) {
      setError("나이 범위를 모두 입력하세요.");
      return;
    }
    if (parseInt(minAge) > parseInt(maxAge)) {
      setError("최소 나이가 최대 나이보다 클 수 없습니다.");
      return;
    }
    try {
      const res = await api.post("/subscriptions", {
        minAge: Number(minAge),
        maxAge: Number(maxAge),
      });
      setSubscription(res.data.subscription);
      setMessage("구독이 성공적으로 등록되었습니다.");
    } catch (err) {
      setError(err.response?.data?.message || "구독 등록 실패");
    }
  }

  async function handleCancel() {
    setError("");
    setMessage("");
    try {
      await api.delete("/subscriptions");
      setSubscription(null);
      setMinAge("");
      setMaxAge("");
      setMessage("구독이 취소되었습니다.");
    } catch (err) {
      setError(err.response?.data?.message || "구독 취소 실패");
    }
  }

  if (loading) return <Layout>로딩중...</Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-5">구독 관리</h2>

      {subscription ? (
        <div className="space-y-4 max-w-sm bg-white p-6 rounded shadow">
          <p>
            현재 구독 범위:{" "}
            <strong>
              {subscription.minAge}세 ~ {subscription.maxAge}세
            </strong>
          </p>
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            구독 취소
          </button>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4 max-w-sm bg-white p-6 rounded shadow">
          <input
            type="number"
            placeholder="최소 나이 (ex: 18)"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="최대 나이 (ex: 25)"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button
            onClick={handleSubscribe}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            구독 시작
          </button>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}
    </Layout>
  );
}
