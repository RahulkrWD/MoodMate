import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UserNotFoundException } from '../../common/exceptions/domain.exceptions';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() currentUser: AuthUser) {
    const user = await this.usersService.findById(currentUser.userId);
    if (!user) throw new UserNotFoundException();
    return this.toProfile(user);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() currentUser: AuthUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(currentUser.userId, {
      name: dto.name,
    });
    return this.toProfile(user);
  }

  @Patch('profile/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_AVATAR_BYTES },
      // Silently drops non-image files (UploadedFile() then comes back
      // undefined below) rather than erroring mid-stream.
      fileFilter: (_req, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'));
      },
    }),
  )
  async updateAvatar(
    @CurrentUser() currentUser: AuthUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('A valid image file is required');

    const avatarUrl = await this.cloudinaryService.uploadAvatar(
      currentUser.userId,
      file,
    );
    const user = await this.usersService.updateProfile(currentUser.userId, {
      avatarUrl,
    });
    return this.toProfile(user);
  }

  private toProfile(user: User) {
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
