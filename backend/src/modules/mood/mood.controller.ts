import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MoodService } from './mood.service';
import { AnalyzeMoodDto } from './dto/analyze-mood.dto';
import { HistoryQueryDto } from './dto/history-query.dto';
import { OptionalAuth } from '../../common/decorators/optional-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

// Tighter than the global default - each call can trigger a Gemini request,
// and GeminiService's own limiter already caps outbound calls to 15/min
// regardless of how many users hit this endpoint concurrently.
const ANALYZE_THROTTLE = { default: { limit: 10, ttl: 60_000 } };

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  // Guest + logged-in both allowed - only logged-in requests get persisted.
  @OptionalAuth()
  @Throttle(ANALYZE_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('analyze')
  analyze(
    @CurrentUser() user: AuthUser | undefined,
    @Body() dto: AnalyzeMoodDto,
  ) {
    return this.moodService.analyze(user?.userId ?? null, dto);
  }

  @Get('history')
  getHistory(@CurrentUser() user: AuthUser, @Query() query: HistoryQueryDto) {
    return this.moodService.getHistory(user.userId, query);
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.moodService.getStats(user.userId);
  }

  @Get('history/:id')
  getHistoryEntry(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.moodService.getHistoryEntry(user.userId, id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('history/:id')
  async deleteHistoryEntry(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    await this.moodService.deleteHistoryEntry(user.userId, id);
    return { deleted: true };
  }
}
