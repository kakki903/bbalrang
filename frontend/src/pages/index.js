import { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-5">
        환영합니다, {user?.email}님 👋
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="font-bold text-indigo-600 mb-2">나의 게시글 수</h3>
          <p className="text-3xl font-extrabold text-gray-900">12</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="font-bold text-indigo-600 mb-2">읽지 않은 쪽지</h3>
          <p className="text-3xl font-extrabold text-gray-900">3</p>
        </div>
      </div>
    </Layout>
  );
}
