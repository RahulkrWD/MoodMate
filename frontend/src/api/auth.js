import { client } from "./client";

export function signup(name, email, password) {
  return client.post("/auth/signup", { name, email, password });
}

export function login(email, password) {
  return client.post("/auth/login", { email, password });
}

export function getProfile() {
  return client.get("/user/profile");
}

export function resendVerification() {
  return client.post("/auth/resend-verification");
}

export function verifyEmail(token) {
  return client.post("/auth/verify-email", { token });
}

export function forgotPassword(email) {
  return client.post("/auth/forgot-password", { email });
}

export function resetPassword(token, newPassword) {
  return client.post("/auth/reset-password", { token, newPassword });
}
