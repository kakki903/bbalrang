import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // 헤더에 토큰 붙이고 유저 정보 요청
    api
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/auth/login");
      });
  }, []);

  if (!user) return <p className="text-center mt-10">로딩 중...</p>;

  return (
    <div className="max-w-md mx-auto mt-12 text-center">
      <h1 className="text-2xl font-bold">👋 {user.nickname}님 환영합니다!</h1>
      <p className="mt-2 text-gray-600">등급: {user.grade}</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        로그아웃
      </button>
    </div>
  );
}
