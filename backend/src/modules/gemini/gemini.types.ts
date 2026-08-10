export interface MoodPromptInput {
  mood: string;
  energyLevel: string;
  dietaryPref: string | null;
  timeAvailable: string | null;
}

export interface MoodRecommendation {
  food: string;
  watch: string;
  activity: string;
}

export interface GeminiRecommendationResult {
  recommendation: MoodRecommendation;
  rawResponse: Record<string, unknown>;
}
