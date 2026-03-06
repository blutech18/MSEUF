import { create } from "zustand";

interface DashboardState {
  sidebarOpen: boolean;
  activeTab: string;
  refreshKey: number;

  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  refresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarOpen: true,
  activeTab: "overview",
  refreshKey: 0,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  refresh: () =>
    set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
