import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "로그인 실패");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-white to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-indigo-700 text-center">
          서비스 로그인
        </h2>
        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
