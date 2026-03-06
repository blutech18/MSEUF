import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { StaffUser } from "@/types";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function hashPassword(password: string): Promise<string> {
  const buf = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface AuthState {
  user: StaffUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;

  setUser: (user: StaffUser | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (v: boolean) => void;
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

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setHasHydrated: (v) => set({ hasHydrated: v }),

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const passwordHash = await hashPassword(password);
          const result = await convex.mutation(api.staff.authenticate, {
            email,
            passwordHash,
          });
          if (!result) {
            set({ isLoading: false });
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
          });
          return true;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "mseuf-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
