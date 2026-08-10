import axios from "axios";
import { tokenStore } from "./tokenStore";

const baseURL = import.meta.env.VITE_API_URL;

export const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const { accessToken } = tokenStore.get();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Unwrap the backend's { success, data } envelope so callers just get `data`.
client.interceptors.response.use((response) => response.data?.data);

let refreshPromise = null;

async function refreshAccessToken() {
  const { refreshToken } = tokenStore.get();
  if (!refreshToken) throw new Error("No refresh token available");

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh`, { refreshToken })
      .then((res) => {
        const tokens = res.data.data;
        tokenStore.set(tokens);
        return tokens;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

client.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;
  const status = error.response?.status;
  const isAuthEndpoint = originalRequest?.url?.startsWith("/auth/");

  if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const { accessToken } = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return client(originalRequest);
    } catch {
      tokenStore.clear();
      tokenStore.notifyAuthExpired();
    }
  }

  return Promise.reject(normalizeError(error));
});

function normalizeError(error) {
  const apiError = error.response?.data?.error;
  const message = apiError?.message ?? error.message ?? "Something went wrong";
  const normalized = new Error(message);
  normalized.code = apiError?.code ?? "UNKNOWN_ERROR";
  normalized.status = error.response?.status;
  return normalized;
}
