import { create } from "zustand";
import type { AnalyticsData } from "@/types";

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  dateRange: { from: string; to: string };

  setData: (data: AnalyticsData) => void;
  setLoading: (loading: boolean) => void;
  setDateRange: (from: string, to: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  dateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  },

  setData: (data) => set({ data, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setDateRange: (from, to) => set({ dateRange: { from, to } }),
}));
