import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UserNotFoundException } from '../../common/exceptions/domain.exceptions';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() currentUser: AuthUser) {
    const user = await this.usersService.findById(currentUser.userId);
    if (!user) throw new UserNotFoundException();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
