import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { useState } from "react";

export default function VerifyEmail() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/verify-email`,
        data
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "인증 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-xl font-bold mb-4">이메일 인증</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email")}
          placeholder="이메일"
          className="w-full border p-2"
        />
        <input
          {...register("code")}
          placeholder="인증 코드"
          className="w-full border p-2"
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2">
          인증하기
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
    </div>
  );
}
