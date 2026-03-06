"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["admin", "librarian", "staff"] },
  { href: "/dashboard/books", label: "Book Management", icon: BookOpen, roles: ["admin", "librarian", "staff"] },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "librarian"] },
  { href: "/dashboard/faqs", label: "FAQ Management", icon: HelpCircle, roles: ["admin", "librarian"] },
  { href: "/dashboard/staff", label: "Staff Accounts", icon: Users, roles: ["admin"] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasHydrated, user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useDashboardStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated && pathname !== "/dashboard/login") {
      router.push("/dashboard/login");
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // Wait for localStorage to rehydrate before deciding auth state
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-800 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/dashboard/login");
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-maroon-800 text-white shadow-lg lg:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-200 bg-white pt-20 transition-transform lg:static lg:translate-x-0 lg:pt-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 p-6">
            <p className="font-heading text-lg font-bold text-maroon-800">
              Staff Dashboard
            </p>
            {user && (
              <p className="mt-1 text-sm text-gray-500">
                {user.name} · {user.role}
              </p>
            )}
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {NAV_LINKS.filter((link) =>
              user?.role ? link.roles.includes(user.role) : false
            ).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-maroon-50 text-maroon-800"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
