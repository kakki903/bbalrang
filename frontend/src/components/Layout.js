import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4 flex-1">{children}</main>
      </div>
    </div>
  );
}
