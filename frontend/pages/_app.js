import "../styles/globals.css";
import UserLayout from "../components/layouts/UserLayout";
import AdminLayout from "../components/layouts/AdminLayout";

export default function App({ Component, pageProps, router }) {
  const path = router.pathname;

  if (path.startsWith("/admin")) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  if (path.startsWith("/user")) {
    return (
      <UserLayout>
        <Component {...pageProps} />
      </UserLayout>
    );
  }

  return <Component {...pageProps} />;
}
