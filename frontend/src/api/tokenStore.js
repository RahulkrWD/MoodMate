// Plain (non-Zustand) module holding the current tokens in memory. The
// axios client reads/writes through here instead of importing the Zustand
// auth store directly - that store's actions call into this same api layer,
// so a direct import would create a circular dependency between the two.
// authStore.js keeps this in sync via a subscription.
let accessToken = null;
let refreshToken = null;
let authExpiredHandler = () => {};

export const tokenStore = {
  get: () => ({ accessToken, refreshToken }),
  set: (tokens) => {
    accessToken = tokens.accessToken ?? null;
    refreshToken = tokens.refreshToken ?? null;
  },
  clear: () => {
    accessToken = null;
    refreshToken = null;
  },
  onAuthExpired: (handler) => {
    authExpiredHandler = handler;
  },
  notifyAuthExpired: () => authExpiredHandler(),
};
