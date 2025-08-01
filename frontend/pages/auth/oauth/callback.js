import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.push("/auth/profile-setup");
    } else {
      router.push("/auth/login");
    }
  }, []);

  return <p className="text-center mt-10">소셜 로그인 처리 중입니다...</p>;
}
