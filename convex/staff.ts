import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Crypto helpers ────────────────────────────────────────────────────────────

const PBKDF2_ITERATIONS = 100_000;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const matches = hex.match(/.{2}/g) ?? [];
  const buf = new ArrayBuffer(matches.length);
  const arr = new Uint8Array(buf);
  matches.forEach((h, i) => { arr[i] = parseInt(h, 16); });
  return arr;
}

async function pbkdf2Hash(
  password: string,
  salt: Uint8Array<ArrayBuffer>
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return bytesToHex(new Uint8Array(hash));
}

/** Hash a new password. Returns { hash, salt } to store in the DB. */
async function hashNewPassword(
  password: string
): Promise<{ hash: string; salt: string }> {
  const saltBuf = new ArrayBuffer(16);
  const salt = new Uint8Array(saltBuf);
  crypto.getRandomValues(salt);
  const hash = await pbkdf2Hash(password, salt);
  return { hash, salt: bytesToHex(salt) };
}

/**
 * Verify a plaintext password against stored credentials.
 * Returns { valid, migratedHash?, migratedSalt? } — when migrating a legacy
 * SHA-256 account, the new PBKDF2 hash/salt are returned for the caller to save.
 */
async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string | undefined | null
): Promise<{ valid: boolean; migratedHash?: string; migratedSalt?: string }> {
  if (storedSalt) {
    // Modern PBKDF2 path
    const computed = await pbkdf2Hash(password, hexToBytes(storedSalt));
    return { valid: computed === storedHash };
  } else {
    // Legacy SHA-256 path — verify, then trigger migration on success
    const computed = await sha256Hex(password);
    if (computed !== storedHash) return { valid: false };
    const { hash: migratedHash, salt: migratedSalt } = await hashNewPassword(password);
    return { valid: true, migratedHash, migratedSalt };
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

// ── Public queries ────────────────────────────────────────────────────────────

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
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

// ── Mutations ─────────────────────────────────────────────────────────────────

export const authenticate = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    const staff = await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase().trim()))
      .first();

    if (!staff || !staff.isActive) return null;

    // Lockout check
    if (staff.lockedUntil && staff.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((staff.lockedUntil - Date.now()) / 60_000);
      throw new Error(
        `Too many failed attempts. Account locked — try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.`
      );
    }

    const { valid, migratedHash, migratedSalt } = await verifyPassword(
      password,
      staff.passwordHash,
      staff.passwordSalt
    );

    if (!valid) {
      const attempts = (staff.loginAttempts ?? 0) + 1;
      const patch: Record<string, unknown> = { loginAttempts: attempts };
      if (attempts >= MAX_ATTEMPTS) {
        patch.lockedUntil = Date.now() + LOCKOUT_MS;
        await ctx.db.patch(staff._id, patch);
        throw new Error(
          `Too many failed attempts. Account locked for 15 minutes.`
        );
      }
      await ctx.db.patch(staff._id, patch);
      return null;
    }

    // Success — reset lockout and optionally migrate hash
    const successPatch: Record<string, unknown> = {
      lastLogin: Date.now(),
      loginAttempts: 0,
      lockedUntil: undefined,
    };
    if (migratedHash && migratedSalt) {
      successPatch.passwordHash = migratedHash;
      successPatch.passwordSalt = migratedSalt;
    }
    await ctx.db.patch(staff._id, successPatch);

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

export const createStaff = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    role: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, { email, name, password, role, avatarUrl }) => {
    const existing = await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase().trim()))
      .first();
    if (existing) throw new Error("Email already in use.");

    const { hash, salt } = await hashNewPassword(password);

    return ctx.db.insert("staff", {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash: hash,
      passwordSalt: salt,
      role,
      avatarUrl,
      isActive: true,
      loginAttempts: 0,
    });
  },
});

export const updateStaff = mutation({
  args: {
    id: v.id("staff"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, { id, name, email, role, password }) => {
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (email !== undefined) updates.email = email.toLowerCase().trim();
    if (role !== undefined) updates.role = role;
    if (password) {
      const { hash, salt } = await hashNewPassword(password);
      updates.passwordHash = hash;
      updates.passwordSalt = salt;
    }
    await ctx.db.patch(id, updates);
  },
});

export const deactivateStaff = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isActive: false });
  },
});

export const reactivateStaff = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isActive: true, loginAttempts: 0, lockedUntil: undefined });
  },
});
