import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class InvalidCredentialsException extends AppException {
  constructor() {
    super(
      'INVALID_CREDENTIALS',
      'Invalid email or password',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class EmailAlreadyExistsException extends AppException {
  constructor() {
    super(
      'EMAIL_ALREADY_EXISTS',
      'An account with this email already exists',
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidOrExpiredTokenException extends AppException {
  constructor(what = 'token') {
    super(
      'INVALID_OR_EXPIRED_TOKEN',
      `This ${what} is invalid or has expired`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserNotFoundException extends AppException {
  constructor() {
    super('USER_NOT_FOUND', 'User not found', HttpStatus.NOT_FOUND);
  }
}

export class EmailAlreadyVerifiedException extends AppException {
  constructor() {
    super(
      'EMAIL_ALREADY_VERIFIED',
      'This email is already verified',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class MoodEntryNotFoundException extends AppException {
  constructor() {
    super('MOOD_ENTRY_NOT_FOUND', 'Mood entry not found', HttpStatus.NOT_FOUND);
  }
}

export class GeminiServiceException extends AppException {
  constructor(message = 'The AI service is temporarily unavailable') {
    super('GEMINI_SERVICE_ERROR', message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
