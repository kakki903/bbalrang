import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-12">MyCommunity</h1>
      <nav className="flex flex-col space-y-4 text-gray-700">
        <Link href="/">
          <a className="hover:text-indigo-600">대시보드</a>
        </Link>
        <Link href="/boards">
          <a className="hover:text-indigo-600">게시판</a>
        </Link>
        <Link href="/messages">
          <a className="hover:text-indigo-600">쪽지</a>
        </Link>
        <Link href="/subscriptions">
          <a className="hover:text-indigo-600">구독</a>
        </Link>
        <Link href="/reports">
          <a className="hover:text-indigo-600">신고내역</a>
        </Link>
      </nav>
    </aside>
  );
}
