import { create } from "zustand";
import type { Book, SearchFilters } from "@/types";

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Book[];
  isSearching: boolean;
  totalResults: number;
  currentPage: number;

  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setResults: (results: Book[], total: number) => void;
  setSearching: (searching: boolean) => void;
  setPage: (page: number) => void;
  resetSearch: () => void;
}

const defaultFilters: SearchFilters = {
  query: "",
};

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  filters: defaultFilters,
  results: [],
  isSearching: false,
  totalResults: 0,
  currentPage: 1,

  setQuery: (query) =>
    set((state) => ({
      query,
      filters: { ...state.filters, query },
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setResults: (results, total) =>
    set({
      results,
      totalResults: total,
      isSearching: false,
    }),

  setSearching: (searching) => set({ isSearching: searching }),
  setPage: (page) => set({ currentPage: page }),
  resetSearch: () =>
    set({
      query: "",
      filters: defaultFilters,
      results: [],
      totalResults: 0,
      currentPage: 1,
    }),
}));
