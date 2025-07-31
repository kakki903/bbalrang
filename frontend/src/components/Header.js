import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex justify-between items-center h-16 px-6 bg-white border-b border-gray-200">
      <div className="font-bold text-lg text-gray-800">대시보드</div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="font-normal text-gray-700">{user.email}</span>
        )}
        {user && (
          <button
            className="text-indigo-600 hover:text-indigo-700"
            onClick={logout}
          >
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
}
