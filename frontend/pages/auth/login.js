import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../lib/api";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
        data
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
      router.push("/user/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "로그인 실패");
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/${provider}`;
    // 예: http://localhost:3001/api/auth/google or kakao
  };

  return (
    <div className="max-w-md mx-auto mt-12 space-y-6">
      <h1 className="text-2xl font-bold text-center">로그인</h1>

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
        <button type="submit" className="w-full bg-blue-600 text-white p-2">
          로그인
        </button>
      </form>

      <div className="border-t pt-6">
        <p className="text-center text-gray-500">또는 소셜 계정으로 로그인</p>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => handleSocialLogin("kakao")}>
            <img src="/kakao.svg" alt="Kakao" width={40} />
          </button>
          <button onClick={() => handleSocialLogin("google")}>
            <img src="/google.svg" alt="Google" width={40} />
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">{message}</p>
    </div>
  );
}
