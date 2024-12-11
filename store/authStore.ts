// store/authStore.ts
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
