import type { BookAvailabilityStatus } from "@/lib/constants";

export interface Book {
  _id: string;
  title: string;
  authors: string[];
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  edition?: string;
  callNumber?: string;
  shelfLocation?: string;
  subject?: string[];
  keywords?: string[];
  abstract?: string;
  language?: string;
  format?: string;
  digitalAccessLink?: string;
  coverImageUrl?: string;
  availability: BookAvailabilityStatus;
  totalCopies?: number;
  availableCopies?: number;
  lastUpdated: number;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  metadata?: {
    books?: Book[];
    suggestions?: string[];
    isLoading?: boolean;
  };
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  lastActivity: number;
}

export interface StaffUser {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "librarian" | "staff";
  avatarUrl?: string;
  lastLogin?: number;
}

export interface SearchFilters {
  query: string;
  author?: string;
  subject?: string;
  language?: string;
  format?: string;
  yearFrom?: number;
  yearTo?: number;
  availability?: BookAvailabilityStatus;
}

export interface AnalyticsData {
  totalBooks: number;
  availableBooks: number;
  unavailableBooks: number;
  totalSearches: number;
  topSearchTerms: { term: string; count: number }[];
  topRequestedBooks: { bookId: string; title: string; count: number }[];
  peakUsageHours: { hour: number; count: number }[];
  dailySearches: { date: string; count: number }[];
}

export interface QueryLog {
  _id: string;
  query: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  resultsCount: number;
  responseTime: number;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Student {
  _id: string;
  studentNumber: string;
  name: string;
  program: string;
  department: string;
  year: number;
  isActive: boolean;
  createdAt: number;
}

export interface VerifiedStudent {
  _id: string;
  studentNumber: string;
  name: string;
  program: string;
  department: string;
  year: number;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}
