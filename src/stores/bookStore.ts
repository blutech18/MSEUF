import { create } from "zustand";
import type { Book } from "@/types";
import type { BookAvailabilityStatus } from "@/lib/constants";

interface BookState {
  books: Book[];
  selectedBook: Book | null;
  isLoading: boolean;
  totalBooks: number;
  availableCount: number;
  unavailableCount: number;

  setBooks: (books: Book[]) => void;
  setSelectedBook: (book: Book | null) => void;
  setLoading: (loading: boolean) => void;
  updateBookAvailability: (
    bookId: string,
    status: BookAvailabilityStatus
  ) => void;
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  updateBook: (bookId: string, data: Partial<Book>) => void;
  setCounts: (total: number, available: number, unavailable: number) => void;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  selectedBook: null,
  isLoading: false,
  totalBooks: 0,
  availableCount: 0,
  unavailableCount: 0,

  setBooks: (books) => set({ books }),
  setSelectedBook: (book) => set({ selectedBook: book }),
  setLoading: (loading) => set({ isLoading: loading }),

  updateBookAvailability: (bookId, status) =>
    set((state) => ({
      books: state.books.map((b) =>
        b._id === bookId ? { ...b, availability: status, lastUpdated: Date.now() } : b
      ),
    })),

  addBook: (book) =>
    set((state) => ({
      books: [book, ...state.books],
      totalBooks: state.totalBooks + 1,
    })),

  removeBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((b) => b._id !== bookId),
      totalBooks: state.totalBooks - 1,
    })),

  updateBook: (bookId, data) =>
    set((state) => ({
      books: state.books.map((b) =>
        b._id === bookId ? { ...b, ...data, lastUpdated: Date.now() } : b
      ),
    })),

  setCounts: (total, available, unavailable) =>
    set({
      totalBooks: total,
      availableCount: available,
      unavailableCount: unavailable,
    }),
}));
