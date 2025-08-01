// /components/layouts/UserLayout.js

import Link from "next/link";

export default function UserLayout({ children }) {
  return (
    <div>
      <header style={{ padding: "1rem", background: "#f0f0f0" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link href="/user/dashboard">대시보드</Link>
          <Link href="/user/profile">프로필</Link>
          <Link href="/user/settings">설정</Link>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
