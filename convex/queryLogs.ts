import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const log = mutation({
  args: {
    query: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    resultsCount: v.number(),
    responseTime: v.number(),
    source: v.optional(v.string()),
    studentId: v.optional(v.string()),
    studentName: v.optional(v.string()),
    department: v.optional(v.string()),
    program: v.optional(v.string()),
    page: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("queryLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const logVisit = mutation({
  args: {
    sessionId: v.string(),
    page: v.string(),
    studentId: v.optional(v.string()),
    studentName: v.optional(v.string()),
    department: v.optional(v.string()),
    program: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("queryLogs", {
      query: `[page_visit] ${args.page}`,
      sessionId: args.sessionId,
      resultsCount: 0,
      responseTime: 0,
      source: "page_visit",
      timestamp: Date.now(),
      studentId: args.studentId,
      studentName: args.studentName,
      department: args.department,
      program: args.program,
      page: args.page,
    });
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("queryLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(args.limit ?? 100);
  },
});

export const getAnalytics = query({
  args: {
    fromTimestamp: v.number(),
    toTimestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("queryLogs")
      .withIndex("by_timestamp")
      .filter((q) =>
        q.and(
          q.gte(q.field("timestamp"), args.fromTimestamp),
          q.lte(q.field("timestamp"), args.toTimestamp)
        )
      )
      .collect();

    const termCounts: Record<string, number> = {};
    const hourCounts: Record<number, number> = {};
    const dayCounts: Record<string, number> = {};
    const sessions = new Set<string>();
    const departmentCounts: Record<string, number> = {};
    const programCounts: Record<string, number> = {};
    const pageCounts: Record<string, number> = {};
    const uniqueStudents = new Set<string>();

    for (const log of logs) {
      if (log.source !== "page_visit") {
        const term = log.query.toLowerCase().trim();
        if (term) {
          termCounts[term] = (termCounts[term] ?? 0) + 1;
        }
      }

      const date = new Date(log.timestamp);
      hourCounts[date.getHours()] = (hourCounts[date.getHours()] ?? 0) + 1;

      const dayKey = date.toISOString().split("T")[0];
      dayCounts[dayKey] = (dayCounts[dayKey] ?? 0) + 1;

      sessions.add(log.sessionId);

      if (log.department) {
        departmentCounts[log.department] =
          (departmentCounts[log.department] ?? 0) + 1;
      }
      if (log.program) {
        programCounts[log.program] = (programCounts[log.program] ?? 0) + 1;
      }
      if (log.page) {
        pageCounts[log.page] = (pageCounts[log.page] ?? 0) + 1;
      }
      if (log.studentId) {
        uniqueStudents.add(log.studentId);
      }
    }

    const topSearchTerms = Object.entries(termCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([term, count]) => ({ term, count }));

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour);

    const dailySearches = Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const byDepartment = Object.entries(departmentCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    const byProgram = Object.entries(programCounts)
      .map(([program, count]) => ({ program, count }))
      .sort((a, b) => b.count - a.count);

    const pageEngagement = Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalSearches: logs.filter((l) => l.source !== "page_visit").length,
      totalVisits: logs.length,
      uniqueSessions: sessions.size,
      uniqueStudents: uniqueStudents.size,
      topSearchTerms,
      peakHours,
      dailySearches,
      byDepartment,
      byProgram,
      pageEngagement,
    };
  },
});
