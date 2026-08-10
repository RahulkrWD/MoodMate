import { client } from "./client";

// Matches the planned M4/M5 backend contract. Not wired into any page yet
// (those endpoints don't exist server-side until M4/M5) - pages currently
// use local sample data instead. Swapping a page over once the backend
// lands is just replacing the sample-data call with these.

export function analyzeMood({ mood, energyLevel, dietaryPref, timeAvailable }) {
  return client.post("/mood/analyze", { mood, energyLevel, dietaryPref, timeAvailable });
}

export function getHistory({ page = 1, limit = 10, mood, from, to } = {}) {
  return client.get("/mood/history", { params: { page, limit, mood, from, to } });
}

export function getHistoryEntry(id) {
  return client.get(`/mood/history/${id}`);
}

export function deleteHistoryEntry(id) {
  return client.delete(`/mood/history/${id}`);
}

export function getStats() {
  return client.get("/mood/stats");
}
