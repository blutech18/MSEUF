import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { StaffUser } from "@/types";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface AuthState {
  user: StaffUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  loginError: string | null;

  setUser: (user: StaffUser | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (v: boolean) => void;
  setLoginError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,
      loginError: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setLoginError: (error) => set({ loginError: error }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, loginError: null });
        try {
          const result = await convex.mutation(api.staff.authenticate, {
            email,
            password,
          });
          if (!result) {
            set({ isLoading: false, loginError: "Invalid email or password." });
            return false;
          }
          set({
            user: {
              _id: result._id,
              email: result.email,
              name: result.name,
              role: result.role as StaffUser["role"],
              avatarUrl: result.avatarUrl ?? undefined,
              lastLogin: result.lastLogin ?? undefined,
            },
            isAuthenticated: true,
            isLoading: false,
            loginError: null,
          });
          return true;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Login failed. Please try again.";
          set({ isLoading: false, loginError: message });
          return false;
        }
      },

      logout: () => set({ user: null, isAuthenticated: false, loginError: null }),
    }),
    {
      name: "mseuf-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
