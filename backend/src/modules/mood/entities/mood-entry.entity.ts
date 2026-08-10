import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Recommendation } from './recommendation.entity';
import { DietaryPref, EnergyLevel, Mood, TimeAvailable } from '../enums/mood.enums';

@Entity('mood_entries')
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nullable - guests can use the core feature without an account.
  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.moodEntries, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'varchar', length: 50 })
  mood: Mood;

  @Column({ type: 'varchar', length: 20, name: 'energy_level' })
  energyLevel: EnergyLevel;

  @Column({ type: 'varchar', length: 20, name: 'dietary_pref', nullable: true })
  dietaryPref: DietaryPref | null;

  @Column({ type: 'varchar', length: 30, name: 'time_available', nullable: true })
  timeAvailable: TimeAvailable | null;

  @Column({ type: 'boolean', name: 'is_serious', default: false })
  isSerious: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Recommendation, (rec) => rec.moodEntry)
  recommendation: Recommendation;
}
