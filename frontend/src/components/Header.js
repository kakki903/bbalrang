import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: "대시보드", href: "/" },
    { name: "게시판", href: "/boards" },
    { name: "쪽지", href: "/messages" },
    { name: "신고내역", href: "/reports" },
    { name: "구독", href: "/subscriptions" },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* 로고 + 네비 */}
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="MyCommunity Logo"
                width={48}
                height={48}
                priority
                className="object-contain"
              />
            </Link>
            <nav className="flex space-x-10">
              {navItems.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-gray-800 text-lg font-semibold hover:text-indigo-600 transition duration-150"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>

          {/* 로그인 영역 */}
          <div className="flex items-center space-x-6 max-w-xs min-w-[120px]">
            {user ? (
              <>
                <span className="text-gray-900 font-semibold select-none truncate">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 transition duration-150"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-indigo-600 text-lg font-semibold hover:text-indigo-800 transition duration-150"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
