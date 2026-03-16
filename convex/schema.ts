import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  students: defineTable({
    studentNumber: v.string(),
    name: v.string(),
    program: v.string(),
    department: v.string(),
    year: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_studentNumber", ["studentNumber"])
    .index("by_department", ["department"])
    .index("by_program", ["program"])
    .index("by_isActive", ["isActive"]),

  books: defineTable({
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
    lastUpdated: v.number(),
    createdAt: v.number(),
  })
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_authors", { searchField: "authors" })
    .searchIndex("search_keywords", { searchField: "keywords" })
    .searchIndex("search_subject", { searchField: "subject" })
    .searchIndex("search_abstract", { searchField: "abstract" })
    .index("by_availability", ["availability"])
    .index("by_callNumber", ["callNumber"])
    .index("by_publicationYear", ["publicationYear"]),

  staff: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    passwordSalt: v.optional(v.string()),
    role: v.string(),
    avatarUrl: v.optional(v.string()),
    lastLogin: v.optional(v.number()),
    isActive: v.boolean(),
    loginAttempts: v.optional(v.number()),
    lockedUntil: v.optional(v.number()),
  }).index("by_email", ["email"]),

  queryLogs: defineTable({
    query: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    timestamp: v.number(),
    resultsCount: v.number(),
    responseTime: v.number(),
    source: v.optional(v.string()),
    studentId: v.optional(v.string()),
    studentName: v.optional(v.string()),
    department: v.optional(v.string()),
    program: v.optional(v.string()),
    page: v.optional(v.string()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_sessionId", ["sessionId"])
    .index("by_department", ["department"])
    .index("by_program", ["program"]),

  chatSessions: defineTable({
    sessionId: v.string(),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
    createdAt: v.number(),
    lastActivity: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
    isActive: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"]),

  availabilityLogs: defineTable({
    bookId: v.id("books"),
    previousStatus: v.string(),
    newStatus: v.string(),
    updatedBy: v.id("staff"),
    timestamp: v.number(),
    note: v.optional(v.string()),
  }).index("by_bookId", ["bookId"]),

  analytics: defineTable({
    date: v.string(),
    totalSearches: v.number(),
    uniqueSessions: v.number(),
    topSearchTerms: v.array(
      v.object({ term: v.string(), count: v.number() })
    ),
    topRequestedBooks: v.array(
      v.object({ bookId: v.string(), title: v.string(), count: v.number() })
    ),
    peakHours: v.array(
      v.object({ hour: v.number(), count: v.number() })
    ),
  }).index("by_date", ["date"]),

  departments: defineTable({
    name: v.string(),
    abbreviation: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_order", ["order"]),

  programs: defineTable({
    name: v.string(),
    departmentId: v.id("departments"),
    isActive: v.boolean(),
  })
    .index("by_departmentId", ["departmentId"])
    .index("by_name", ["name"]),

  appointments: defineTable({
    name: v.string(),
    studentId: v.string(),
    email: v.string(),
    date: v.string(),
    time: v.string(),
    purpose: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  registrations: defineTable({
    name: v.string(),
    studentId: v.string(),
    email: v.string(),
    department: v.string(),
    program: v.optional(v.string()),
    yearLevel: v.string(),
    contact: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_studentId", ["studentId"]),

  bookRenewals: defineTable({
    name: v.string(),
    libraryCardNumber: v.string(),
    bookTitle: v.string(),
    callNumber: v.string(),
    dateBorrowed: v.string(),
    renewalPeriod: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  surveys: defineTable({
    ratings: v.array(v.object({ criterion: v.string(), rating: v.number() })),
    comments: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
