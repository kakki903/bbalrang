import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await api.get("/reports");
        setReports(res.data.reports);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <Layout>로딩중...</Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-5">신고 내역</h2>
      <ul className="space-y-4">
        {reports.length === 0 && <p>신고된 내역이 없습니다.</p>}
        {reports.map((report) => (
          <li key={report.id} className="p-4 bg-white rounded-lg shadow">
            <p>
              <strong>신고자 ID:</strong> {report.reporterId}
            </p>
            <p>
              <strong>타입:</strong> {report.targetType}
            </p>
            <p>
              <strong>대상 ID:</strong> {report.targetId}
            </p>
            <p>
              <strong>사유:</strong> {report.reason}
            </p>
            <p>
              <strong>상태:</strong> {report.status}
            </p>
            <p className="text-sm text-gray-500">
              신고일: {new Date(report.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
