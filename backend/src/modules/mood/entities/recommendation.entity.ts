import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MoodEntry } from './mood-entry.entity';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'mood_entry_id', unique: true })
  moodEntryId: string;

  @OneToOne(() => MoodEntry, (entry) => entry.recommendation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mood_entry_id' })
  moodEntry: MoodEntry;

  @Column({ type: 'text', name: 'food_suggestion', nullable: true })
  foodSuggestion: string | null;

  @Column({ type: 'text', name: 'watch_suggestion', nullable: true })
  watchSuggestion: string | null;

  @Column({ type: 'text', name: 'activity_suggestion', nullable: true })
  activitySuggestion: string | null;

  // Full raw Gemini response, kept for debugging.
  @Column({ type: 'jsonb', name: 'raw_ai_response', nullable: true })
  rawAiResponse: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
