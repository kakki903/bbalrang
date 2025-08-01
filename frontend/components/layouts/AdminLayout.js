// /components/layouts/AdminLayout.js

import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div>
      <header style={{ padding: "1rem", background: "#222", color: "#fff" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin">관리 홈</Link>
          <Link href="/admin/users">회원 목록</Link>
          <Link href="/admin/settings">설정</Link>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
