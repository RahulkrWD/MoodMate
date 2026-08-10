import { create } from "zustand";

// authModal: null | "login" | "signup" | "forgot-password"
export const useUIStore = create((set) => ({
  authModal: null,
  openAuthModal: (mode = "login") => set({ authModal: mode }),
  closeAuthModal: () => set({ authModal: null }),
}));
