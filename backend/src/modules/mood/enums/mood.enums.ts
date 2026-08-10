export enum Mood {
  HAPPY = 'happy',
  SAD = 'sad',
  STRESSED = 'stressed',
  LOW_ENERGY = 'low_energy',
  ANXIOUS = 'anxious',
  BORED = 'bored',
  ANGRY = 'angry',
  HOPELESS = 'hopeless',
  VERY_LOW = 'very_low',
}

// Moods that skip/supplement the usual AI suggestions with a gentle,
// hardcoded "talk to someone" message instead of leaving this to the AI.
export const SERIOUS_MOODS: ReadonlySet<Mood> = new Set([
  Mood.HOPELESS,
  Mood.VERY_LOW,
]);

export enum EnergyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum DietaryPref {
  VEG = 'veg',
  NON_VEG = 'non-veg',
  NONE = 'none',
}

export enum TimeAvailable {
  UNDER_30_MIN = 'under_30_min',
  THIRTY_TO_60_MIN = '30_to_60_min',
  ONE_TO_2_HOURS = '1_to_2_hours',
  HALF_DAY_PLUS = 'half_day_plus',
}
