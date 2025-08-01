import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { useRouter } from "next/router";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        data
      );
      console.log("✅ 회원가입 성공:", res.data);

      setMessage(res.data.message);
      router.push("/auth/verify-email");
    } catch (err) {
      console.error("❌ 회원가입 에러 전체:", err); // 전체 Axios 에러 객체
      console.log("❗️ err.response:", err.response);
      console.log("❗️ err.message:", err.message);
      setMessage(err.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email")}
          placeholder="이메일"
          className="w-full border p-2"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          className="w-full border p-2"
        />
        <input
          {...register("nickname")}
          placeholder="닉네임"
          className="w-full border p-2"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2">
          가입하기
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
    </div>
  );
}
