import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto mt-12 text-center space-y-4">
      <h1 className="text-2xl font-bold">🚀 Welcome to the Auth System</h1>
      <div className="space-x-4">
        <Link href="/auth/register" className="text-blue-600 underline">
          회원가입
        </Link>
        <Link href="/auth/login" className="text-blue-600 underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
