import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "../api/auth";
import { tokenStore } from "../api/tokenStore";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setSession: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      login: async (email, password) => {
        const data = await authApi.login(email, password);
        get().setSession(data);
        return data.user;
      },

      signup: async (name, email, password) => {
        const data = await authApi.signup(name, email, password);
        get().setSession(data);
        return data.user;
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      refreshProfile: async () => {
        const profile = await authApi.getProfile();
        set((state) => ({ user: { ...state.user, ...profile } }));
        return profile;
      },

      updateUser: (patch) => set((state) => ({ user: { ...state.user, ...patch } })),
    }),
    {
      name: "moodmate-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// The axios client can't import this Zustand store (its own actions call
// into the api layer the client lives in - that'd be a circular import), so
// it reads tokens from the plain tokenStore module instead. Keep the two in
// sync here.
tokenStore.set({
  accessToken: useAuthStore.getState().accessToken,
  refreshToken: useAuthStore.getState().refreshToken,
});
useAuthStore.subscribe((state) => {
  tokenStore.set({ accessToken: state.accessToken, refreshToken: state.refreshToken });
});
tokenStore.onAuthExpired(() => useAuthStore.getState().logout());
