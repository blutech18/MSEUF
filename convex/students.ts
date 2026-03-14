import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const verify = query({
  args: {
    studentNumber: v.string(),
    name: v.string(),
    program: v.string(),
    department: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query("students")
      .withIndex("by_studentNumber", (q) =>
        q.eq("studentNumber", args.studentNumber)
      )
      .first();

    if (!student) return { verified: false, reason: "Student number not found" };
    if (!student.isActive)
      return { verified: false, reason: "Student is no longer enrolled" };

    const nameMatch =
      student.name.toLowerCase().trim() === args.name.toLowerCase().trim();
    const programMatch =
      student.program.toLowerCase().trim() === args.program.toLowerCase().trim();
    const departmentMatch =
      student.department.toLowerCase().trim() ===
      args.department.toLowerCase().trim();
    const yearMatch = student.year === args.year;

    if (!nameMatch)
      return { verified: false, reason: "Name does not match records" };
    if (!programMatch)
      return { verified: false, reason: "Program does not match records" };
    if (!departmentMatch)
      return { verified: false, reason: "Department does not match records" };
    if (!yearMatch)
      return { verified: false, reason: "Year does not match records" };

    return {
      verified: true,
      student: {
        _id: student._id,
        studentNumber: student.studentNumber,
        name: student.name,
        program: student.program,
        department: student.department,
        year: student.year,
      },
    };
  },
});

export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
    department: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let students;

    if (args.department) {
      students = await ctx.db
        .query("students")
        .withIndex("by_department", (q) => q.eq("department", args.department!))
        .collect();
    } else {
      students = await ctx.db.query("students").collect();
    }

    if (args.activeOnly) {
      students = students.filter((s) => s.isActive);
    }

    if (args.searchQuery) {
      const q = args.searchQuery.toLowerCase();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentNumber.toLowerCase().includes(q) ||
          s.program.toLowerCase().includes(q)
      );
    }

    return students.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    studentNumber: v.string(),
    name: v.string(),
    program: v.string(),
    department: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("students")
      .withIndex("by_studentNumber", (q) =>
        q.eq("studentNumber", args.studentNumber)
      )
      .first();

    if (existing) {
      throw new Error("A student with this student number already exists");
    }

    return await ctx.db.insert("students", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("students"),
    name: v.optional(v.string()),
    program: v.optional(v.string()),
    department: v.optional(v.string()),
    year: v.optional(v.number()),
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
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deactivate = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false });
  },
});

export const reactivate = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: true });
  },
});

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("students").collect();
    const active = all.filter((s) => s.isActive);

    const byDepartment: Record<string, number> = {};
    const byProgram: Record<string, number> = {};

    for (const s of active) {
      byDepartment[s.department] = (byDepartment[s.department] ?? 0) + 1;
      byProgram[s.program] = (byProgram[s.program] ?? 0) + 1;
    }

    return {
      total: all.length,
      active: active.length,
      inactive: all.length - active.length,
      byDepartment: Object.entries(byDepartment)
        .map(([department, count]) => ({ department, count }))
        .sort((a, b) => b.count - a.count),
      byProgram: Object.entries(byProgram)
        .map(([program, count]) => ({ program, count }))
        .sort((a, b) => b.count - a.count),
    };
  },
});

export const getNextStudentNumber = query({
  args: {},
  handler: async (ctx) => {
    const currentYear = new Date().getFullYear().toString();
    const students = await ctx.db.query("students").collect();

    const maxNum = students
      .map((s) => s.studentNumber)
      .filter((n) => n.startsWith(currentYear + "-"))
      .map((n) => parseInt(n.split("-")[1] || "0", 10))
      .filter((n) => !isNaN(n))
      .reduce((max, n) => Math.max(max, n), 0);

    return `${currentYear}-${(maxNum + 1).toString().padStart(5, "0")}`;
  },
});

export const bulkImport = mutation({
  args: {
    students: v.array(
      v.object({
        studentNumber: v.string(),
        name: v.string(),
        program: v.string(),
        department: v.string(),
        year: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let imported = 0;
    let skipped = 0;

    for (const student of args.students) {
      const existing = await ctx.db
        .query("students")
        .withIndex("by_studentNumber", (q) =>
          q.eq("studentNumber", student.studentNumber)
        )
        .first();

      if (existing) {
        skipped++;
        continue;
      }

      await ctx.db.insert("students", {
        ...student,
        isActive: true,
        createdAt: Date.now(),
      });
      imported++;
    }

    return { imported, skipped };
  },
});
