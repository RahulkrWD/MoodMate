import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntry } from './entities/mood-entry.entity';
import { Recommendation } from './entities/recommendation.entity';
import { MoodService } from './mood.service';
import { MoodController } from './mood.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoodEntry, Recommendation]),
    GeminiModule,
  ],
  controllers: [MoodController],
  providers: [MoodService],
})
export class MoodModule {}
