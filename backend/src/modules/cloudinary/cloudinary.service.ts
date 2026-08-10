import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import {
  AvatarUploadFailedException,
  AvatarUploadUnavailableException,
} from '../../common/exceptions/domain.exceptions';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly configured: boolean;

  constructor(config: ConfigService) {
    const cloud_name = config.get<string>('CLOUDINARY_CLOUD_NAME');
    const api_key = config.get<string>('CLOUDINARY_API_KEY');
    const api_secret = config.get<string>('CLOUDINARY_API_SECRET');

    this.configured = Boolean(cloud_name && api_key && api_secret);
    if (this.configured) {
      cloudinary.config({ cloud_name, api_key, api_secret });
    }
  }

  uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
    // Avatar upload is optional per the spec - a missing Cloudinary config
    // shouldn't crash the app, just make this one endpoint unavailable.
    if (!this.configured) {
      throw new AvatarUploadUnavailableException();
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'moodmate/avatars',
          public_id: userId,
          overwrite: true,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error(
              `Cloudinary upload failed: ${error?.message ?? 'unknown error'}`,
            );
            reject(new AvatarUploadFailedException());
            return;
          }
          resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });
  }
}
