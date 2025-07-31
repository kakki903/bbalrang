import { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <h2 className="text-3xl font-semibold mb-8 text-gray-900">
        환영합니다,{" "}
        <span className="text-indigo-600">{user?.email || "게스트"}</span>님 👋
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-indigo-700 font-bold mb-3">나의 게시글 수</h3>
          <p className="text-4xl font-extrabold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-indigo-700 font-bold mb-3">읽지 않은 쪽지</h3>
          <p className="text-4xl font-extrabold text-gray-900">3</p>
        </div>
      </div>
    </Layout>
  );
}
