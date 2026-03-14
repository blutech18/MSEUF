"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  Search,
  Clock,
  TrendingUp,
  BookOpen,
  Calendar,
  Loader2,
  Users,
  Building2,
  GraduationCap,
  Eye,
  MousePointer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";

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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PRESET_RANGES = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 15 days", days: 15 },
  { label: "Last 30 days", days: 30 },
];

export default function AnalyticsPage() {
  const [activePreset, setActivePreset] = useState<number>(30);

  const [dateFrom, setDateFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calSelectMode, setCalSelectMode] = useState<"from" | "to">("from");

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
  const maxDeptCount = analytics?.byDepartment
    ? Math.max(...analytics.byDepartment.map((d) => d.count), 1)
    : 1;
  const maxProgCount = analytics?.byProgram
    ? Math.max(...analytics.byProgram.map((p) => p.count), 1)
    : 1;

  const handlePreset = (days: number) => {
    setActivePreset(days);
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setDateFrom(from.toISOString().split("T")[0]);
    setDateTo(to.toISOString().split("T")[0]);
  };

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [calYear, calMonth]);

  const dailyCountMap = useMemo(() => {
    if (!analytics?.dailySearches) return {};
    const map: Record<string, number> = {};
    for (const d of analytics.dailySearches) {
      map[d.date] = d.count;
    }
    return map;
  }, [analytics?.dailySearches]);

  const handleCalendarSelect = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (calSelectMode === "from") {
      setDateFrom(dateStr);
      setCalSelectMode("to");
      if (dateStr > dateTo) setDateTo(dateStr);
    } else {
      if (dateStr < dateFrom) {
        setDateFrom(dateStr);
      } else {
        setDateTo(dateStr);
      }
      setCalSelectMode("from");
    }
    setActivePreset(0);
  };

  const isInRange = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr >= dateFrom && dateStr <= dateTo;
  };

  const isRangeStart = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr === dateFrom;
  };

  const isRangeEnd = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr === dateTo;
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Analytics &amp; Reports
          </h1>
          <p className="text-sm text-gray-500">
            Usage statistics connected to student verification
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_RANGES.map((preset) => (
            <button
              key={preset.days}
              onClick={() => handlePreset(preset.days)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                activePreset === preset.days
                  ? "bg-maroon-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar + Date Range */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-gray-900">
            <Calendar className="h-4 w-4 text-maroon-600" />
            Select Date Range
          </h2>
          <p className="mb-3 text-xs text-gray-500">
            Selecting:{" "}
            <span className="font-medium text-maroon-700">
              {calSelectMode === "from" ? "Start date" : "End date"}
            </span>
          </p>
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="rounded-lg p-1 transition-colors hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-800">
                {MONTH_NAMES[calMonth]} {calYear}
              </span>
              <button
                onClick={nextMonth}
                className="rounded-lg p-1 transition-colors hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="py-1 text-[10px] font-medium text-gray-400"
                >
                  {d}
                </div>
              ))}
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} />;
                }
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasData = dailyCountMap[dateStr] && dailyCountMap[dateStr] > 0;
                const inRange = isInRange(day);
                const start = isRangeStart(day);
                const end = isRangeEnd(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleCalendarSelect(day)}
                    className={cn(
                      "relative flex h-8 items-center justify-center rounded-md text-xs transition-colors",
                      inRange && !start && !end && "bg-maroon-50",
                      start && "bg-maroon-800 text-white",
                      end && !start && "bg-maroon-700 text-white",
                      !inRange && "hover:bg-gray-100",
                      !inRange && "text-gray-700"
                    )}
                  >
                    {day}
                    {hasData && !start && !end && (
                      <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-maroon-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">Range:</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 font-mono">
              {dateFrom}
            </span>
            <span>to</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 font-mono">
              {dateTo}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "Usage Volume",
                  value: analytics.totalSearches.toLocaleString(),
                  sub: "total chatbot queries",
                  icon: Search,
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Total Visits",
                  value: analytics.totalVisits.toLocaleString(),
                  sub: "all interactions",
                  icon: Eye,
                  color: "bg-indigo-50 text-indigo-700",
                },
                {
                  label: "Unique Sessions",
                  value: analytics.uniqueSessions.toLocaleString(),
                  sub: "browser sessions",
                  icon: Users,
                  color: "bg-purple-50 text-purple-700",
                },
                {
                  label: "Verified Students",
                  value: analytics.uniqueStudents.toLocaleString(),
                  sub: "unique students",
                  icon: GraduationCap,
                  color: "bg-green-50 text-green-700",
                },
                {
                  label: "Books in Catalog",
                  value: bookCounts?.total.toLocaleString() ?? "—",
                  sub: `${bookCounts?.available ?? 0} available`,
                  icon: BookOpen,
                  color: "bg-amber-50 text-amber-700",
                },
                {
                  label: "Departments Active",
                  value: (analytics.byDepartment?.length ?? 0).toString(),
                  sub: "with chatbot usage",
                  icon: Building2,
                  color: "bg-rose-50 text-rose-700",
                },
              ].map((stat) => (
                <div key={stat.label} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {stat.sub}
                      </p>
                    </div>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isLoading && (
        <>
          {/* Usage by Department & Program */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-gray-900">
                <Building2 className="h-4 w-4 text-maroon-600" />
                Usage by Department
              </h2>
              {analytics.byDepartment && analytics.byDepartment.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {analytics.byDepartment.map((item, i) => (
                    <div key={item.department} className="flex items-center gap-3">
                      <span className="w-5 text-right text-xs font-medium text-gray-400">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 line-clamp-1">
                            {item.department}
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {item.count}
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-maroon-600"
                            style={{
                              width: `${(item.count / maxDeptCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-center text-sm text-gray-400">
                  No department data for the selected period.
                </p>
              )}
            </div>

            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-gray-900">
                <GraduationCap className="h-4 w-4 text-maroon-600" />
                Usage by Program
              </h2>
              {analytics.byProgram && analytics.byProgram.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {analytics.byProgram.slice(0, 10).map((item, i) => (
                    <div key={item.program} className="flex items-center gap-3">
                      <span className="w-5 text-right text-xs font-medium text-gray-400">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 line-clamp-1">
                            {item.program}
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {item.count}
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-gold-500"
                            style={{
                              width: `${(item.count / maxProgCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-center text-sm text-gray-400">
                  No program data for the selected period.
                </p>
              )}
            </div>
          </div>

          {/* Page Engagement */}
          {analytics.pageEngagement && analytics.pageEngagement.length > 0 && (
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-gray-900">
                <MousePointer className="h-4 w-4 text-maroon-600" />
                Page Engagement
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {analytics.pageEngagement.slice(0, 8).map((item) => {
                  const maxPage = Math.max(
                    ...analytics.pageEngagement!.map((p) => p.count),
                    1
                  );
                  return (
                    <div
                      key={item.page}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">
                        {item.page}
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {item.count}
                      </p>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full bg-indigo-500"
                          style={{
                            width: `${(item.count / maxPage) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Searches + Book Inventory */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-gray-900">
                <TrendingUp className="h-4 w-4 text-maroon-600" />
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
                      <span className="w-5 text-right text-xs font-medium text-gray-400">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">
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

            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-gray-900">
                <BookOpen className="h-4 w-4 text-maroon-600" />
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

          {/* Peak Hours + Daily Volume */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-gray-900">
                <Clock className="h-4 w-4 text-maroon-600" />
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

            <div className="card">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-gray-900">
                <BarChart3 className="h-4 w-4 text-maroon-600" />
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
