import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeIcon,
  ClipboardIcon,
  ChatBubbleLeftIcon,
  BellAlertIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "대시보드", href: "/", icon: HomeIcon },
  { name: "게시판", href: "/boards", icon: ClipboardIcon },
  { name: "쪽지", href: "/messages", icon: ChatBubbleLeftIcon },
  { name: "신고내역", href: "/reports", icon: BellAlertIcon },
  { name: "구독", href: "/subscriptions", icon: UserGroupIcon },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6 min-h-screen">
      <div className="mb-12 text-indigo-700 font-extrabold text-3xl select-none">
        MyCommunity
      </div>
      <nav className="flex flex-col space-y-3">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 py-2 px-4 rounded-md transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
