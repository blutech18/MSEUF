"use client";

import { useState } from "react";
import {
  BarChart3,
  Search,
  Clock,
  TrendingUp,
  BookOpen,
  Calendar,
  Loader2,
  Users,
} from "lucide-react";
import Input from "@/components/ui/Input";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  const fromTs = new Date(dateFrom + "T00:00:00").getTime();
  const toTs = new Date(dateTo + "T23:59:59").getTime();

  const analytics = useQuery(api.queryLogs.getAnalytics, {
    fromTimestamp: fromTs,
    toTimestamp: toTs,
  });
  const bookCounts = useQuery(api.books.getCounts);

  const isLoading = analytics === undefined || bookCounts === undefined;

  const maxSearchCount = analytics
    ? Math.max(...analytics.topSearchTerms.map((t) => t.count), 1)
    : 1;
  const maxPeakCount = analytics
    ? Math.max(...analytics.peakHours.map((h) => h.count), 1)
    : 1;
  const maxDailyCount = analytics
    ? Math.max(...analytics.dailySearches.map((d) => d.count), 1)
    : 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Analytics &amp; Reports
          </h1>
          <p className="text-sm text-gray-500">
            Live usage statistics from the chatbot and catalog
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-36"
          />
          <span className="text-gray-400">–</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-36"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Searches",
                value: analytics.totalSearches.toLocaleString(),
                icon: Search,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Unique Sessions",
                value: analytics.uniqueSessions.toLocaleString(),
                icon: Users,
                color: "bg-purple-50 text-purple-700",
              },
              {
                label: "Books in Catalog",
                value: bookCounts?.total.toLocaleString() ?? "—",
                icon: BookOpen,
                color: "bg-green-50 text-green-700",
              },
              {
                label: "Available Books",
                value: bookCounts?.available.toLocaleString() ?? "—",
                icon: Clock,
                color: "bg-amber-50 text-amber-700",
              },
            ].map((stat) => (
              <div key={stat.label} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Top Search Terms */}
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-gray-900">
                <TrendingUp className="h-5 w-5 text-maroon-600" />
                Most Searched Topics
              </h2>
              {analytics.topSearchTerms.length === 0 ? (
                <p className="mt-6 text-center text-sm text-gray-400">
                  No search data for the selected period.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {analytics.topSearchTerms.slice(0, 10).map((item, i) => (
                    <div key={item.term} className="flex items-center gap-3">
                      <span className="w-6 text-right text-xs font-medium text-gray-400">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {item.term}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.count}
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-maroon-600"
                            style={{
                              width: `${(item.count / maxSearchCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Book Inventory Breakdown */}
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-gray-900">
                <BookOpen className="h-5 w-5 text-maroon-600" />
                Book Inventory Breakdown
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  {
                    label: "Available",
                    value: bookCounts?.available ?? 0,
                    color: "bg-green-500",
                  },
                  {
                    label: "Unavailable",
                    value: bookCounts?.unavailable ?? 0,
                    color: "bg-red-500",
                  },
                  {
                    label: "Reserved",
                    value: bookCounts?.reserved ?? 0,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Under Maintenance",
                    value: bookCounts?.maintenance ?? 0,
                    color: "bg-orange-500",
                  },
                ].map((item) => {
                  const total = bookCounts?.total ?? 1;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {item.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{
                              width: `${(item.value / total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Peak Usage Hours */}
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-gray-900">
                <Clock className="h-5 w-5 text-maroon-600" />
                Peak Usage Hours
              </h2>
              {analytics.peakHours.length === 0 ? (
                <p className="mt-6 text-center text-sm text-gray-400">
                  No usage data for the selected period.
                </p>
              ) : (
                <div
                  className="mt-4 flex items-end gap-1"
                  style={{ height: 200 }}
                >
                  {analytics.peakHours.map((h) => (
                    <div
                      key={h.hour}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <span className="text-[10px] text-gray-500">
                        {h.count}
                      </span>
                      <div
                        className="w-full rounded-t bg-maroon-600 transition-all hover:bg-maroon-700"
                        style={{
                          height: `${(h.count / maxPeakCount) * 160}px`,
                        }}
                      />
                      <span className="text-[10px] text-gray-500">
                        {formatHour(h.hour)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Search Volume */}
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-gray-900">
                <BarChart3 className="h-5 w-5 text-maroon-600" />
                Daily Search Volume
              </h2>
              {analytics.dailySearches.length === 0 ? (
                <p className="mt-6 text-center text-sm text-gray-400">
                  No search activity in the selected period.
                </p>
              ) : (
                <div
                  className="mt-4 flex items-end gap-1"
                  style={{ height: 200 }}
                >
                  {analytics.dailySearches.slice(-14).map((d) => (
                    <div
                      key={d.date}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-medium text-gray-700">
                        {d.count}
                      </span>
                      <div
                        className="w-full rounded-t bg-gold-500 transition-all hover:bg-gold-600"
                        style={{
                          height: `${(d.count / maxDailyCount) * 160}px`,
                        }}
                      />
                      <span className="text-[10px] text-gray-500">
                        {formatDate(d.date)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

