import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Submit mutations (public — student-facing) ───────────────────────────────

export const submitAppointment = mutation({
  args: {
    name: v.string(),
    studentId: v.string(),
    email: v.string(),
    date: v.string(),
    time: v.string(),
    purpose: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("appointments", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const submitRegistration = mutation({
  args: {
    name: v.string(),
    studentId: v.string(),
    email: v.string(),
    department: v.string(),
    yearLevel: v.string(),
    contact: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("registrations", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const submitBookRenewal = mutation({
  args: {
    name: v.string(),
    libraryCardNumber: v.string(),
    bookTitle: v.string(),
    callNumber: v.string(),
    dateBorrowed: v.string(),
    renewalPeriod: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("bookRenewals", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const submitSurvey = mutation({
  args: {
    ratings: v.array(v.object({ criterion: v.string(), rating: v.number() })),
    comments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("surveys", {
      ratings: args.ratings,
      comments: args.comments || undefined,
      createdAt: Date.now(),
    });
  },
});

// ── Dashboard queries ─────────────────────────────────────────────────────────

export const listAppointments = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    let rows;
    if (status) {
      rows = await ctx.db
        .query("appointments")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      rows = await ctx.db.query("appointments").collect();
    }
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listRegistrations = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    let rows;
    if (status) {
      rows = await ctx.db
        .query("registrations")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      rows = await ctx.db.query("registrations").collect();
    }
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listBookRenewals = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    let rows;
    if (status) {
      rows = await ctx.db
        .query("bookRenewals")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      rows = await ctx.db.query("bookRenewals").collect();
    }
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listSurveys = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("surveys").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getFormCounts = query({
  args: {},
  handler: async (ctx) => {
    const [appointments, registrations, renewals, surveys] = await Promise.all([
      ctx.db.query("appointments").collect(),
      ctx.db.query("registrations").collect(),
      ctx.db.query("bookRenewals").collect(),
      ctx.db.query("surveys").collect(),
    ]);
    return {
      appointments: { total: appointments.length, pending: appointments.filter((a) => a.status === "pending").length },
      registrations: { total: registrations.length, pending: registrations.filter((r) => r.status === "pending").length },
      renewals: { total: renewals.length, pending: renewals.filter((r) => r.status === "pending").length },
      surveys: { total: surveys.length },
    };
  },
});

// ── Dashboard mutations (status updates) ──────────────────────────────────────

export const updateAppointmentStatus = mutation({
  args: { id: v.id("appointments"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const updateRegistrationStatus = mutation({
  args: { id: v.id("registrations"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const updateRenewalStatus = mutation({
  args: { id: v.id("bookRenewals"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});
