import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Departments ──────────────────────────────────────────────────────────────

export const listDepartments = query({
  args: { includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, { includeInactive }) => {
    const all = await ctx.db
      .query("departments")
      .withIndex("by_order")
      .collect();
    return includeInactive ? all : all.filter((d) => d.isActive);
  },
});

export const createDepartment = mutation({
  args: {
    name: v.string(),
    abbreviation: v.optional(v.string()),
  },
  handler: async (ctx, { name, abbreviation }) => {
    const existing = await ctx.db
      .query("departments")
      .withIndex("by_name", (q) => q.eq("name", name.trim()))
      .first();
    if (existing) throw new Error("A department with that name already exists.");

    const all = await ctx.db.query("departments").collect();
    const order = all.length > 0 ? Math.max(...all.map((d) => d.order)) + 1 : 1;

    return ctx.db.insert("departments", {
      name: name.trim(),
      abbreviation: abbreviation?.trim() || undefined,
      isActive: true,
      order,
    });
  },
});

export const updateDepartment = mutation({
  args: {
    id: v.id("departments"),
    name: v.string(),
    abbreviation: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, name, abbreviation, isActive }) => {
    const conflict = await ctx.db
      .query("departments")
      .withIndex("by_name", (q) => q.eq("name", name.trim()))
      .first();
    if (conflict && conflict._id !== id) {
      throw new Error("A department with that name already exists.");
    }
    await ctx.db.patch(id, {
      name: name.trim(),
      abbreviation: abbreviation?.trim() || undefined,
      isActive,
    });
  },
});

export const deleteDepartment = mutation({
  args: { id: v.id("departments") },
  handler: async (ctx, { id }) => {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_departmentId", (q) => q.eq("departmentId", id))
      .collect();
    if (programs.length > 0) {
      throw new Error(
        `Cannot delete: this department has ${programs.length} program(s). Remove them first.`
      );
    }
    await ctx.db.delete(id);
  },
});

// ── Programs ─────────────────────────────────────────────────────────────────

export const listPrograms = query({
  args: {
    departmentId: v.optional(v.id("departments")),
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, { departmentId, includeInactive }) => {
    let rows;
    if (departmentId) {
      rows = await ctx.db
        .query("programs")
        .withIndex("by_departmentId", (q) => q.eq("departmentId", departmentId))
        .collect();
    } else {
      rows = await ctx.db.query("programs").collect();
    }
    if (!includeInactive) rows = rows.filter((p) => p.isActive);

    // Attach department name for convenience
    const depts = await ctx.db.query("departments").collect();
    const deptMap = Object.fromEntries(depts.map((d) => [d._id, d.name]));
    return rows.map((p) => ({ ...p, departmentName: deptMap[p.departmentId] ?? "" }));
  },
});

export const createProgram = mutation({
  args: {
    name: v.string(),
    departmentId: v.id("departments"),
  },
  handler: async (ctx, { name, departmentId }) => {
    const existing = await ctx.db
      .query("programs")
      .withIndex("by_name", (q) => q.eq("name", name.trim()))
      .first();
    if (existing) throw new Error("A program with that name already exists.");

    return ctx.db.insert("programs", {
      name: name.trim(),
      departmentId,
      isActive: true,
    });
  },
});

export const updateProgram = mutation({
  args: {
    id: v.id("programs"),
    name: v.string(),
    departmentId: v.id("departments"),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, name, departmentId, isActive }) => {
    const conflict = await ctx.db
      .query("programs")
      .withIndex("by_name", (q) => q.eq("name", name.trim()))
      .first();
    if (conflict && conflict._id !== id) {
      throw new Error("A program with that name already exists.");
    }
    await ctx.db.patch(id, { name: name.trim(), departmentId, isActive });
  },
});

export const deleteProgram = mutation({
  args: { id: v.id("programs") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ── Seed ─────────────────────────────────────────────────────────────────────

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    const existingDepts = await ctx.db.query("departments").collect();
    if (existingDepts.length > 0) return { skipped: true };

    const SEED_DATA: Array<{ name: string; abbreviation: string; programs: string[] }> = [
      {
        name: "College of Arts and Sciences",
        abbreviation: "CAS",
        programs: ["BS Psychology", "BS Biology", "BA Communication", "BA Political Science", "BS Mathematics"],
      },
      {
        name: "College of Business and Accountancy",
        abbreviation: "CBA",
        programs: ["BS Accountancy", "BS Business Administration", "BS Management Accounting", "BS Entrepreneurship"],
      },
      {
        name: "College of Education",
        abbreviation: "COE",
        programs: ["Bachelor of Elementary Education", "Bachelor of Secondary Education", "Bachelor of Physical Education"],
      },
      {
        name: "College of Engineering",
        abbreviation: "COEng",
        programs: ["BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering", "BS Electronics Engineering", "BS Computer Engineering", "BS Industrial Engineering"],
      },
      {
        name: "College of Nursing and Health Sciences",
        abbreviation: "CNHS",
        programs: ["BS Nursing", "BS Medical Technology", "BS Pharmacy"],
      },
      {
        name: "Institute of Graduate Studies and Research",
        abbreviation: "IGSR",
        programs: ["Master of Arts in Education", "Master in Business Administration", "Doctor of Education"],
      },
    ];

    for (let i = 0; i < SEED_DATA.length; i++) {
      const { name, abbreviation, programs } = SEED_DATA[i];
      const deptId = await ctx.db.insert("departments", {
        name,
        abbreviation,
        isActive: true,
        order: i + 1,
      });
      for (const prog of programs) {
        await ctx.db.insert("programs", { name: prog, departmentId: deptId, isActive: true });
      }
    }
    return { skipped: false };
  },
});
