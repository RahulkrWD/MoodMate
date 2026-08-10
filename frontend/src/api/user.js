import { client } from "./client";

// PATCH /user/profile (name/phone) and avatar upload both land in M6 -
// not wired into the Profile page yet, see api/mood.js note.

export function updateProfile({ name }) {
  return client.patch("/user/profile", { name });
}

export function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  return client.patch("/user/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
