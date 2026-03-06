import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const authenticate = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const staff = await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!staff || !staff.isActive) return null;
    if (staff.passwordHash !== args.passwordHash) return null;

    await ctx.db.patch(staff._id, { lastLogin: Date.now() });

    return {
      _id: staff._id,
      email: staff.email,
      name: staff.name,
      role: staff.role,
      avatarUrl: staff.avatarUrl,
      lastLogin: Date.now(),
    };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("staff")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("staff").collect();
  },
});

export const createStaff = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("Email already in use");
    return await ctx.db.insert("staff", {
      ...args,
      isActive: true,
      lastLogin: Date.now(),
    });
  },
});

export const updateStaff = mutation({
  args: {
    id: v.id("staff"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
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

export const deactivateStaff = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false });
  },
});

export const reactivateStaff = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: true });
  },
});
