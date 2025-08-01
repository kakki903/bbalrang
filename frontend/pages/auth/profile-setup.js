import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { useRouter } from "next/router";

export default function ProfileSetup() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    try {
      await api.post("/users/complete-profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/user/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "프로필 저장 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-xl font-bold mb-4">추가 정보 입력</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("nickname")}
          placeholder="닉네임"
          className="w-full border p-2"
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2">
          저장하고 시작하기
        </button>
      </form>
    </div>
  );
}
