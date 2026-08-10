import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from '@google/genai';
import Bottleneck from 'bottleneck';
import { GeminiServiceException } from '../../common/exceptions/domain.exceptions';
import {
  GeminiRecommendationResult,
  MoodPromptInput,
  MoodRecommendation,
} from './gemini.types';

const MODEL = 'gemini-2.5-flash-lite';

// Response schema, enforced by Gemini itself (responseMimeType +
// responseSchema) rather than trusted from prompt wording alone - this is
// what actually keeps the output reliably parseable.
const RECOMMENDATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    food: { type: Type.STRING },
    watch: { type: Type.STRING },
    activity: { type: Type.STRING },
  },
  required: ['food', 'watch', 'activity'],
};

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly client: GoogleGenAI;

  // Second layer of rate limiting (on top of NestJS throttler guarding our
  // own /mood/analyze endpoint): caps our own outbound call rate so
  // concurrent users can never collectively exceed Gemini's free-tier limit
  // (15 requests/min), regardless of how much traffic hits our API.
  private readonly limiter = new Bottleneck({
    reservoir: 15,
    reservoirRefreshAmount: 15,
    reservoirRefreshInterval: 60_000,
    maxConcurrent: 5,
  });

  constructor(private readonly config: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.config.get<string>('GEMINI_API_KEY'),
    });
  }

  private buildPrompt(input: MoodPromptInput): string {
    const dietary = input.dietaryPref ?? 'no particular';
    const time = input.timeAvailable ?? 'an unspecified amount of';
    return `The user feels ${input.mood}, their energy level is ${input.energyLevel}, they have ${dietary} dietary preference, and ${time} time available.
Suggest exactly one food to eat, one thing to watch, and one activity to do that would genuinely help improve their mood right now. Keep each suggestion to a single short, specific sentence - not generic advice.
Respond only with JSON matching the given schema.`;
  }

  private isValidRecommendation(value: unknown): value is MoodRecommendation {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
      typeof v.food === 'string' &&
      v.food.trim().length > 0 &&
      typeof v.watch === 'string' &&
      v.watch.trim().length > 0 &&
      typeof v.activity === 'string' &&
      v.activity.trim().length > 0
    );
  }

  private async attempt(input: MoodPromptInput): Promise<GeminiRecommendationResult> {
    const response = await this.limiter.schedule(() =>
      this.client.models.generateContent({
        model: MODEL,
        contents: this.buildPrompt(input),
        config: {
          responseMimeType: 'application/json',
          responseSchema: RECOMMENDATION_SCHEMA,
        },
      }),
    );

    const text = response.text;
    if (!text) throw new Error('Gemini returned an empty response');

    const parsed: unknown = JSON.parse(text);
    if (!this.isValidRecommendation(parsed)) {
      throw new Error('Gemini response did not match the expected shape');
    }

    return {
      recommendation: parsed,
      rawResponse: parsed as unknown as Record<string, unknown>,
    };
  }

  // Retries once on any failure (network error, malformed/empty response,
  // schema mismatch) before giving up - the caller (MoodService) is
  // responsible for falling back to a generic suggestion set so an AI
  // failure never breaks the user-facing flow.
  async generateMoodRecommendation(
    input: MoodPromptInput,
  ): Promise<GeminiRecommendationResult> {
    try {
      return await this.attempt(input);
    } catch (firstError) {
      this.logger.warn(`Gemini call failed, retrying once: ${firstError}`);
      try {
        return await this.attempt(input);
      } catch (secondError) {
        this.logger.error(`Gemini call failed twice, giving up: ${secondError}`);
        throw new GeminiServiceException();
      }
    }
  }
}
