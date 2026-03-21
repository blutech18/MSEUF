import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Create a reservation (student-facing) ────────────────────────────────────

export const create = mutation({
  args: {
    bookId: v.id("books"),
    studentNumber: v.string(),
    studentName: v.string(),
    department: v.string(),
    program: v.string(),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Book not found");

    const availableCopies = book.availableCopies ?? 1;
    if (availableCopies <= 0) {
      throw new Error("No copies available for reservation");
    }

    // Check if student already has an active reservation for this book
    const existing = await ctx.db
      .query("reservations")
      .withIndex("by_bookId", (q) => q.eq("bookId", args.bookId))
      .collect();

    const hasActive = existing.some(
      (r) =>
        r.studentNumber === args.studentNumber &&
        ["pending", "confirmed", "borrowed"].includes(r.status)
    );

    if (hasActive) {
      throw new Error("You already have an active reservation for this book");
    }

    // Create the reservation (expires in 24 hours)
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

    const reservationId = await ctx.db.insert("reservations", {
      bookId: args.bookId,
      studentNumber: args.studentNumber,
      studentName: args.studentName,
      department: args.department,
      program: args.program,
      status: "pending",
      createdAt: now,
      expiresAt,
    });

    // Decrement available copies
    const newAvailable = availableCopies - 1;
    await ctx.db.patch(args.bookId, {
      availableCopies: newAvailable,
      availability: newAvailable <= 0 ? "unavailable" : "available",
      lastUpdated: now,
    });

    return reservationId;
  },
});

// ── List reservations (dashboard) ─────────────────────────────────────────────

export const list = query({
  args: {
    bookId: v.optional(v.id("books")),
    status: v.optional(v.string()),
    studentNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let rows;

    if (args.bookId) {
      rows = await ctx.db
        .query("reservations")
        .withIndex("by_bookId", (q) => q.eq("bookId", args.bookId!))
        .collect();
    } else if (args.status) {
      rows = await ctx.db
        .query("reservations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else if (args.studentNumber) {
      rows = await ctx.db
        .query("reservations")
        .withIndex("by_studentNumber", (q) =>
          q.eq("studentNumber", args.studentNumber!)
        )
        .collect();
    } else {
      rows = await ctx.db.query("reservations").collect();
    }

    // Enrich with book title
    const enriched = await Promise.all(
      rows.map(async (r) => {
        const book = await ctx.db.get(r.bookId);
        return {
          ...r,
          bookTitle: book?.title ?? "Unknown Book",
          bookCallNumber: book?.callNumber ?? "",
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ── Get reservation counts ────────────────────────────────────────────────────

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("reservations").collect();
    return {
      total: all.length,
      pending: all.filter((r) => r.status === "pending").length,
      confirmed: all.filter((r) => r.status === "confirmed").length,
      borrowed: all.filter((r) => r.status === "borrowed").length,
      returned: all.filter((r) => r.status === "returned").length,
      cancelled: all.filter((r) => r.status === "cancelled").length,
      expired: all.filter((r) => r.status === "expired").length,
    };
  },
});

// ── Update reservation status (librarian) ─────────────────────────────────────

export const updateStatus = mutation({
  args: {
    id: v.id("reservations"),
    status: v.string(),
    dateBorrowed: v.optional(v.string()),
    returnDate: v.optional(v.string()),
    cancelReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.id);
    if (!reservation) throw new Error("Reservation not found");

    const updates: Record<string, unknown> = { status: args.status };
    if (args.dateBorrowed !== undefined) updates.dateBorrowed = args.dateBorrowed;
    if (args.returnDate !== undefined) updates.returnDate = args.returnDate;
    if (args.cancelReason !== undefined) updates.cancelReason = args.cancelReason;

    await ctx.db.patch(args.id, updates);

    // If cancelled or expired, restore the available copy
    if (
      (args.status === "cancelled" || args.status === "expired") &&
      reservation.status !== "cancelled" &&
      reservation.status !== "expired" &&
      reservation.status !== "returned"
    ) {
      const book = await ctx.db.get(reservation.bookId);
      if (book) {
        const newAvailable = (book.availableCopies ?? 0) + 1;
        await ctx.db.patch(reservation.bookId, {
          availableCopies: newAvailable,
          availability: newAvailable > 0 ? "available" : "unavailable",
          lastUpdated: Date.now(),
        });
      }
    }

    // If returned, restore the available copy
    if (args.status === "returned" && reservation.status === "borrowed") {
      const book = await ctx.db.get(reservation.bookId);
      if (book) {
        const newAvailable = (book.availableCopies ?? 0) + 1;
        await ctx.db.patch(reservation.bookId, {
          availableCopies: newAvailable,
          availability: newAvailable > 0 ? "available" : "unavailable",
          lastUpdated: Date.now(),
        });
      }
    }
  },
});

// ── Delete reservation ────────────────────────────────────────────────────────

export const remove = mutation({
  args: { id: v.id("reservations") },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.id);
    if (reservation && ["pending", "confirmed"].includes(reservation.status)) {
      // Restore available copy if reservation was active
      const book = await ctx.db.get(reservation.bookId);
      if (book) {
        const newAvailable = (book.availableCopies ?? 0) + 1;
        await ctx.db.patch(reservation.bookId, {
          availableCopies: newAvailable,
          availability: newAvailable > 0 ? "available" : "unavailable",
          lastUpdated: Date.now(),
        });
      }
    }
    await ctx.db.delete(args.id);
  },
});

// ── Auto-expire pending reservations past 24 hours ────────────────────────────

export const expireOverdue = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const pending = await ctx.db
      .query("reservations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    let expired = 0;
    for (const r of pending) {
      if (r.expiresAt <= now) {
        await ctx.db.patch(r._id, {
          status: "expired",
          cancelReason: "Auto-expired: not claimed within 24 hours",
        });

        // Restore available copy
        const book = await ctx.db.get(r.bookId);
        if (book) {
          const newAvailable = (book.availableCopies ?? 0) + 1;
          await ctx.db.patch(r.bookId, {
            availableCopies: newAvailable,
            availability: newAvailable > 0 ? "available" : "unavailable",
            lastUpdated: Date.now(),
          });
        }
        expired++;
      }
    }
    return { expired };
  },
});

// ── Get reservations for a specific student ───────────────────────────────────

export const getByStudent = query({
  args: { studentNumber: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("reservations")
      .withIndex("by_studentNumber", (q) =>
        q.eq("studentNumber", args.studentNumber)
      )
      .collect();

    const enriched = await Promise.all(
      rows.map(async (r) => {
        const book = await ctx.db.get(r.bookId);
        return {
          ...r,
          bookTitle: book?.title ?? "Unknown Book",
          bookAvailableCopies: book?.availableCopies ?? 0,
          bookTotalCopies: book?.totalCopies ?? 1,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});
