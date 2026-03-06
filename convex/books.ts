import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    availability: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    if (args.availability) {
      return await ctx.db
        .query("books")
        .withIndex("by_availability", (q) =>
          q.eq("availability", args.availability!)
        )
        .take(limit);
    }
    return await ctx.db.query("books").order("desc").take(limit);
  },
});

export const getById = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    if (!args.query.trim()) {
      return await ctx.db.query("books").order("desc").take(limit);
    }

    // Search across all indexes and merge results
    const [byTitle, byKeywords, bySubject, byAuthors] = await Promise.all([
      ctx.db
        .query("books")
        .withSearchIndex("search_title", (q) => q.search("title", args.query))
        .take(limit),
      ctx.db
        .query("books")
        .withSearchIndex("search_keywords", (q) => q.search("keywords", args.query))
        .take(limit),
      ctx.db
        .query("books")
        .withSearchIndex("search_subject", (q) => q.search("subject", args.query))
        .take(limit),
      ctx.db
        .query("books")
        .withSearchIndex("search_authors", (q) => q.search("authors", args.query))
        .take(limit),
    ]);

    // Deduplicate by _id, preserving order (title matches first)
    const seen = new Set<string>();
    const merged = [];
    for (const book of [...byTitle, ...byKeywords, ...bySubject, ...byAuthors]) {
      if (!seen.has(book._id)) {
        seen.add(book._id);
        merged.push(book);
      }
    }

    return merged.slice(0, limit);
  },
});

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("books").collect();
    const available = all.filter((b) => b.availability === "available").length;
    const unavailable = all.filter(
      (b) => b.availability === "unavailable"
    ).length;
    const reserved = all.filter((b) => b.availability === "reserved").length;
    const maintenance = all.filter(
      (b) => b.availability === "maintenance"
    ).length;

    return {
      total: all.length,
      available,
      unavailable,
      reserved,
      maintenance,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    authors: v.array(v.string()),
    isbn: v.optional(v.string()),
    publisher: v.optional(v.string()),
    publicationYear: v.optional(v.number()),
    edition: v.optional(v.string()),
    callNumber: v.optional(v.string()),
    shelfLocation: v.optional(v.string()),
    subject: v.optional(v.array(v.string())),
    keywords: v.optional(v.array(v.string())),
    abstract: v.optional(v.string()),
    language: v.optional(v.string()),
    format: v.optional(v.string()),
    digitalAccessLink: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    availability: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("books", {
      ...args,
      lastUpdated: now,
      createdAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    authors: v.optional(v.array(v.string())),
    isbn: v.optional(v.string()),
    publisher: v.optional(v.string()),
    publicationYear: v.optional(v.number()),
    edition: v.optional(v.string()),
    callNumber: v.optional(v.string()),
    shelfLocation: v.optional(v.string()),
    subject: v.optional(v.array(v.string())),
    keywords: v.optional(v.array(v.string())),
    abstract: v.optional(v.string()),
    language: v.optional(v.string()),
    format: v.optional(v.string()),
    digitalAccessLink: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    availability: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = { lastUpdated: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

export const updateAvailability = mutation({
  args: {
    id: v.id("books"),
    availability: v.string(),
    staffId: v.optional(v.id("staff")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.id);
    if (!book) throw new Error("Book not found");

    const previousStatus = book.availability;
    await ctx.db.patch(args.id, {
      availability: args.availability,
      lastUpdated: Date.now(),
    });

    if (args.staffId) {
      await ctx.db.insert("availabilityLogs", {
        bookId: args.id,
        previousStatus,
        newStatus: args.availability,
        updatedBy: args.staffId,
        timestamp: Date.now(),
        note: args.note,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const bulkImport = mutation({
  args: {
    books: v.array(
      v.object({
        title: v.string(),
        authors: v.array(v.string()),
        publisher: v.optional(v.string()),
        publicationYear: v.optional(v.number()),
        subject: v.optional(v.array(v.string())),
        keywords: v.optional(v.array(v.string())),
        language: v.optional(v.string()),
        format: v.optional(v.string()),
        availability: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let count = 0;
    for (const book of args.books) {
      await ctx.db.insert("books", {
        ...book,
        lastUpdated: now,
        createdAt: now,
      });
      count++;
    }
    return `Imported ${count} books`;
  },
});
