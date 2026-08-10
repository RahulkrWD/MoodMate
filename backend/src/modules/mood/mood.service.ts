import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodEntry } from './entities/mood-entry.entity';
import { Recommendation } from './entities/recommendation.entity';
import { SERIOUS_MOODS } from './enums/mood.enums';
import { AnalyzeMoodDto } from './dto/analyze-mood.dto';
import { HistoryQueryDto } from './dto/history-query.dto';
import { GeminiService } from '../gemini/gemini.service';
import { MoodEntryNotFoundException } from '../../common/exceptions/domain.exceptions';

const SERIOUS_MOOD_MESSAGE =
  "It sounds like you're carrying something heavier than a quick suggestion can help with. " +
  'Please consider talking to someone you trust, or a mental health professional. ' +
  "If you're in immediate danger, contact your local emergency services or a crisis line right away.";

// Used when Gemini fails twice in a row (GeminiService already retried
// internally) - keeps the flow working instead of surfacing a 503, per the
// "never let an AI failure break the user flow" rule. Not persisted as a
// genuine AI answer: raw_ai_response stays null so it stays distinguishable.
const FALLBACK_RECOMMENDATION = {
  food: 'Something simple and comforting that you already enjoy.',
  watch: 'A show or movie you find relaxing and familiar.',
  activity: 'A short walk, stretch, or a few minutes of quiet time.',
};

interface HistoryRow {
  id: string;
  mood: string;
  energy_level: string;
  dietary_pref: string | null;
  time_available: string | null;
  is_serious: boolean;
  created_at: Date;
  food_suggestion: string | null;
  watch_suggestion: string | null;
  activity_suggestion: string | null;
}

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntry)
    private readonly moodEntryRepository: Repository<MoodEntry>,
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    private readonly geminiService: GeminiService,
  ) {}

  async analyze(userId: string | null, dto: AnalyzeMoodDto) {
    // Serious moods are a hardcoded, server-side branch - never left to the
    // AI's judgment. Still logged (if the caller is logged in) so it shows
    // up in history, but skips Gemini entirely.
    const isSerious = SERIOUS_MOODS.has(dto.mood);
    if (isSerious) {
      if (userId) await this.saveEntry(userId, dto, true);
      return {
        isSerious: true,
        message: SERIOUS_MOOD_MESSAGE,
        recommendation: null,
      };
    }

    let recommendation = FALLBACK_RECOMMENDATION;
    let rawResponse: Record<string, unknown> | null = null;
    let isFallback = true;
    try {
      const result = await this.geminiService.generateMoodRecommendation({
        mood: dto.mood,
        energyLevel: dto.energyLevel,
        dietaryPref: dto.dietaryPref ?? null,
        timeAvailable: dto.timeAvailable ?? null,
      });
      recommendation = result.recommendation;
      rawResponse = result.rawResponse;
      isFallback = false;
    } catch {
      // Already logged inside GeminiService - fall back silently.
    }

    if (userId) {
      const entry = await this.saveEntry(userId, dto, false);
      await this.recommendationRepository.save(
        this.recommendationRepository.create({
          moodEntryId: entry.id,
          foodSuggestion: recommendation.food,
          watchSuggestion: recommendation.watch,
          activitySuggestion: recommendation.activity,
          rawAiResponse: rawResponse,
        }),
      );
    }

    return { isSerious: false, isFallback, recommendation };
  }

  private saveEntry(
    userId: string,
    dto: AnalyzeMoodDto,
    isSerious: boolean,
  ): Promise<MoodEntry> {
    return this.moodEntryRepository.save(
      this.moodEntryRepository.create({
        userId,
        mood: dto.mood,
        energyLevel: dto.energyLevel,
        dietaryPref: dto.dietaryPref ?? null,
        timeAvailable: dto.timeAvailable ?? null,
        isSerious,
      }),
    );
  }

  async getHistory(userId: string, query: HistoryQueryDto) {
    // orderBy needs the entity property path (createdAt), not the raw
    // column name - TypeORM resolves it through entity metadata when
    // combined with skip/take, and fails silently on a raw column name.
    const qb = this.moodEntryRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.recommendation', 'recommendation')
      .where('entry.user_id = :userId', { userId })
      .orderBy('entry.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    if (query.mood) qb.andWhere('entry.mood = :mood', { mood: query.mood });
    if (query.from)
      qb.andWhere('entry.createdAt >= :from', { from: query.from });
    if (query.to) qb.andWhere('entry.createdAt <= :to', { to: query.to });

    const [entries, total] = await qb.getManyAndCount();

    return {
      items: entries.map((entry) => ({
        id: entry.id,
        mood: entry.mood,
        energyLevel: entry.energyLevel,
        dietaryPref: entry.dietaryPref,
        timeAvailable: entry.timeAvailable,
        isSerious: entry.isSerious,
        createdAt: entry.createdAt,
        recommendation: entry.recommendation
          ? {
              food: entry.recommendation.foodSuggestion,
              watch: entry.recommendation.watchSuggestion,
              activity: entry.recommendation.activitySuggestion,
            }
          : null,
      })),
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async getHistoryEntry(userId: string, id: string) {
    // Raw SQL join, per the spec's showcase of hand-written SQL alongside
    // TypeORM/QueryBuilder usage elsewhere in this module.
    const rows: HistoryRow[] = await this.moodEntryRepository.query(
      `SELECT e.id, e.mood, e.energy_level, e.dietary_pref, e.time_available,
              e.is_serious, e.created_at,
              r.food_suggestion, r.watch_suggestion, r.activity_suggestion
       FROM mood_entries e
       LEFT JOIN recommendations r ON r.mood_entry_id = e.id
       WHERE e.id = $1 AND e.user_id = $2
       LIMIT 1`,
      [id, userId],
    );

    const row = rows[0];
    if (!row) throw new MoodEntryNotFoundException();

    return {
      id: row.id,
      mood: row.mood,
      energyLevel: row.energy_level,
      dietaryPref: row.dietary_pref,
      timeAvailable: row.time_available,
      isSerious: row.is_serious,
      createdAt: row.created_at,
      recommendation:
        row.food_suggestion !== null
          ? {
              food: row.food_suggestion,
              watch: row.watch_suggestion,
              activity: row.activity_suggestion,
            }
          : null,
    };
  }

  async deleteHistoryEntry(userId: string, id: string): Promise<void> {
    const result = await this.moodEntryRepository.delete({ id, userId });
    if (!result.affected) throw new MoodEntryNotFoundException();
  }

  async getStats(userId: string) {
    const frequencyRows: { mood: string; count: number }[] =
      await this.moodEntryRepository.query(
        `SELECT mood, COUNT(*)::int AS count
         FROM mood_entries
         WHERE user_id = $1
         GROUP BY mood
         ORDER BY count DESC`,
        [userId],
      );

    // Weekly trend over the last ~12 weeks - good GROUP BY showcase for the
    // history dashboard's trend chart.
    const weeklyRows: { week: Date; count: number }[] =
      await this.moodEntryRepository.query(
        `SELECT date_trunc('week', created_at) AS week, COUNT(*)::int AS count
       FROM mood_entries
       WHERE user_id = $1 AND created_at >= now() - interval '12 weeks'
       GROUP BY week
       ORDER BY week ASC`,
        [userId],
      );

    const totalCheckIns = frequencyRows.reduce(
      (sum, row) => sum + row.count,
      0,
    );

    return {
      totalCheckIns,
      topMood: frequencyRows[0]
        ? { mood: frequencyRows[0].mood, count: frequencyRows[0].count }
        : null,
      frequency: Object.fromEntries(
        frequencyRows.map((row) => [row.mood, row.count]),
      ),
      weeklyTrend: weeklyRows.map((row) => ({
        week: row.week,
        count: row.count,
      })),
    };
  }
}
