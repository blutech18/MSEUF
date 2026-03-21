"use client";

import { useEffect, useState } from "react";
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
  GraduationCap,
  Building2,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["admin", "librarian", "staff"] },
  { href: "/dashboard/books", label: "Book Management", icon: BookOpen, roles: ["admin", "librarian", "staff"] },
  { href: "/dashboard/reservations", label: "Reservations", icon: CalendarCheck, roles: ["admin", "librarian", "staff"] },
  { href: "/dashboard/students", label: "Student Management", icon: GraduationCap, roles: ["admin", "librarian"] },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "librarian"] },
  { href: "/dashboard/faqs", label: "FAQ Management", icon: HelpCircle, roles: ["admin", "librarian"] },
  { href: "/dashboard/forms", label: "Form Submissions", icon: ClipboardList, roles: ["admin", "librarian"] },
  { href: "/dashboard/programs", label: "Programs & Departments", icon: Building2, roles: ["admin"] },
  { href: "/dashboard/staff", label: "Staff Accounts", icon: Users, roles: ["admin"] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasHydrated, user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useDashboardStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    <div className="flex w-full items-start min-h-[calc(100vh-125px)]">
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
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-200 bg-white transition-transform lg:sticky lg:top-[125px] lg:h-[calc(100vh-125px)] lg:translate-x-0 pt-20 lg:pt-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 p-6 shrink-0">
            <p className="font-heading text-lg font-bold text-maroon-800">
              Staff Dashboard
            </p>
            {user && (
              <p className="mt-1 text-sm text-gray-500">
                {user.name} · {user.role}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1 p-4">
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

            <div className="p-4 pt-0">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
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
      <div className="flex-1 w-full min-w-0">
        <div className="p-6 lg:p-8">{children}</div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to log out of your account?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
