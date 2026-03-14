"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Loader2,
  Users,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
  const counts = useQuery(api.books.getCounts);
  const studentCounts = useQuery(api.students.getCounts);
  const recentBooks = useQuery(api.books.list, { limit: 5 });
  const { user } = useAuthStore();

  const isLoading = counts === undefined || recentBooks === undefined;

  const stats = counts
    ? [
        { label: "Total Books", value: counts.total, icon: BookOpen, color: "bg-blue-50 text-blue-700" },
        { label: "Available", value: counts.available, icon: CheckCircle, color: "bg-green-50 text-green-700" },
        { label: "Enrolled Students", value: studentCounts?.active ?? 0, icon: GraduationCap, color: "bg-purple-50 text-purple-700" },
        { label: "Reserved", value: counts.reserved, icon: Clock, color: "bg-yellow-50 text-yellow-700" },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}. Here&apos;s a live summary of your library system.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Books */}
            <div className="card">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="font-heading text-lg font-bold text-gray-900">
                  Recent Book Records
                </h2>
                <Link
                  href="/dashboard/books"
                  className="flex items-center gap-1 text-sm font-medium text-maroon-700 hover:text-maroon-900"
                >
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {(recentBooks ?? []).map((book) => (
                  <div
                    key={book._id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {book.authors.join(", ")}
                      </p>
                    </div>
                    <span
                      className={`ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        book.availability === "available"
                          ? "bg-green-100 text-green-700"
                          : book.availability === "reserved"
                            ? "bg-yellow-100 text-yellow-700"
                            : book.availability === "maintenance"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.availability}
                    </span>
                  </div>
                ))}
                {recentBooks?.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No books in the catalog yet.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="card">
                <h2 className="font-heading text-lg font-bold text-gray-900">
                  Quick Actions
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard/books"
                    className="flex flex-col items-center gap-2 rounded-xl bg-maroon-50 p-4 text-center transition-colors hover:bg-maroon-100"
                  >
                    <BookOpen className="h-8 w-8 text-maroon-700" />
                    <span className="text-sm font-medium text-maroon-800">Manage Books</span>
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex flex-col items-center gap-2 rounded-xl bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100"
                  >
                    <TrendingUp className="h-8 w-8 text-blue-700" />
                    <span className="text-sm font-medium text-blue-800">View Analytics</span>
                  </Link>
                  <Link
                    href="/dashboard/students"
                    className="flex flex-col items-center gap-2 rounded-xl bg-green-50 p-4 text-center transition-colors hover:bg-green-100"
                  >
                    <GraduationCap className="h-8 w-8 text-green-700" />
                    <span className="text-sm font-medium text-green-800">Manage Students</span>
                  </Link>
                  {user?.role === "admin" ? (
                    <Link
                      href="/dashboard/staff"
                      className="flex flex-col items-center gap-2 rounded-xl bg-amber-50 p-4 text-center transition-colors hover:bg-amber-100"
                    >
                      <Users className="h-8 w-8 text-amber-700" />
                      <span className="text-sm font-medium text-amber-800">Staff Accounts</span>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/faqs"
                      className="flex flex-col items-center gap-2 rounded-xl bg-amber-50 p-4 text-center transition-colors hover:bg-amber-100"
                    >
                      <HelpCircle className="h-8 w-8 text-amber-700" />
                      <span className="text-sm font-medium text-amber-800">Manage FAQs</span>
                    </Link>
                  )}
                </div>
              </div>

              <div className="card bg-linear-to-br from-maroon-800 to-maroon-900 text-white">
                <h3 className="font-heading text-lg font-bold">System Status</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-maroon-200">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    AI Chatbot (ROSe): Online
                  </div>
                  <div className="flex items-center gap-2 text-sm text-maroon-200">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    Database: Connected
                  </div>
                  <div className="flex items-center gap-2 text-sm text-maroon-200">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    {counts?.total.toLocaleString() ?? "—"} books in catalog
                  </div>
                  <div className="flex items-center gap-2 text-sm text-maroon-200">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    {studentCounts?.active.toLocaleString() ?? "—"} enrolled students
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
