import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.category) {
      results = await ctx.db
        .query("faqs")
        .withIndex("by_category", (q) =>
          q.eq("category", args.category!)
        )
        .collect();
    } else {
      results = await ctx.db.query("faqs").collect();
    }

    if (args.activeOnly !== false) {
      return results
        .filter((f) => f.isActive)
        .sort((a, b) => a.order - b.order);
    }
    return results.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("faqs", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("faqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
