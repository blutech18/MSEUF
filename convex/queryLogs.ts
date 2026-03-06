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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("queryLogs", {
      ...args,
      timestamp: Date.now(),
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

    for (const log of logs) {
      const term = log.query.toLowerCase().trim();
      if (term) {
        termCounts[term] = (termCounts[term] ?? 0) + 1;
      }

      const date = new Date(log.timestamp);
      hourCounts[date.getHours()] = (hourCounts[date.getHours()] ?? 0) + 1;

      const dayKey = date.toISOString().split("T")[0];
      dayCounts[dayKey] = (dayCounts[dayKey] ?? 0) + 1;

      sessions.add(log.sessionId);
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

    return {
      totalSearches: logs.length,
      uniqueSessions: sessions.size,
      topSearchTerms,
      peakHours,
      dailySearches,
    };
  },
});
