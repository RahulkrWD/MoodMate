import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MoodEntry } from '../../mood/entities/mood-entry.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'text', name: 'avatar_url', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'boolean', name: 'is_verified', default: false })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => MoodEntry, (entry) => entry.user)
  moodEntries: MoodEntry[];
}
