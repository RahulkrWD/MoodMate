import {
  Smile,
  Frown,
  CloudRain,
  BatteryLow,
  AlertTriangle,
  Meh,
  Angry,
  CloudDrizzle,
  HeartCrack,
} from "lucide-react";

// Mirrors backend/src/modules/mood/enums/mood.enums.ts - keep in sync.
export const MOODS = [
  { value: "happy", label: "Happy", icon: Smile },
  { value: "sad", label: "Sad", icon: Frown },
  { value: "stressed", label: "Stressed", icon: CloudRain },
  { value: "low_energy", label: "Low energy", icon: BatteryLow },
  { value: "anxious", label: "Anxious", icon: AlertTriangle },
  { value: "bored", label: "Bored", icon: Meh },
  { value: "angry", label: "Angry", icon: Angry },
  { value: "hopeless", label: "Hopeless", icon: CloudDrizzle },
  { value: "very_low", label: "Very low", icon: HeartCrack },
];

export const SERIOUS_MOODS = new Set(["hopeless", "very_low"]);

export const ENERGY_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const DIETARY_PREFS = [
  { value: "none", label: "No preference" },
  { value: "veg", label: "Vegetarian" },
  { value: "non-veg", label: "Non-vegetarian" },
];

export const TIME_AVAILABLE = [
  { value: "under_30_min", label: "Under 30 min" },
  { value: "30_to_60_min", label: "30–60 min" },
  { value: "1_to_2_hours", label: "1–2 hours" },
  { value: "half_day_plus", label: "Half a day+" },
];

export function moodLabel(value) {
  return MOODS.find((m) => m.value === value)?.label ?? value;
}
