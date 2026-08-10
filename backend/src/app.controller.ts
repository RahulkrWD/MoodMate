import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return { success: true, message: 'MoodMate API is running' };
  }
}
