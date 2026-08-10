// Placeholder history/stats shown until GET /mood/history and
// GET /mood/stats exist (M5). Shape mirrors the planned API response so
// HistoryPage only needs its data source swapped later, not its rendering.
import { getSampleRecommendation } from "./sampleRecommendations";

const MOOD_SEQUENCE = [
  "happy",
  "stressed",
  "bored",
  "sad",
  "happy",
  "anxious",
  "low_energy",
  "happy",
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function getSampleHistory() {
  return MOOD_SEQUENCE.map((mood, i) => ({
    id: `sample-${i}`,
    mood,
    energyLevel: ["low", "medium", "high"][i % 3],
    createdAt: daysAgo(i * 2),
    recommendation: getSampleRecommendation(mood),
  }));
}

export function getSampleStats(entries) {
  const frequency = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] ?? 0) + 1;
    return acc;
  }, {});
  const topMood = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];
  return {
    totalCheckIns: entries.length,
    topMood: topMood ? { mood: topMood[0], count: topMood[1] } : null,
    frequency,
  };
}
