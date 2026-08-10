import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import {
  EmailAlreadyExistsException,
  EmailAlreadyVerifiedException,
  InvalidCredentialsException,
  InvalidOrExpiredTokenException,
  UserNotFoundException,
} from '../../common/exceptions/domain.exceptions';
import { User } from '../users/entities/user.entity';

const BCRYPT_ROUNDS = 10;

// Config values come back as plain `string` (e.g. "15m"), but JwtSignOptions
// types `expiresIn` against the `ms` package's strict template-literal type.
// jsonwebtoken parses these fine at runtime - this only satisfies the compiler.
const asExpiresIn = (value: string): JwtSignOptions['expiresIn'] =>
  value as JwtSignOptions['expiresIn'];

type ActionTokenType = 'email_verify' | 'password_reset';

interface AccessRefreshPayload {
  sub: string;
  email: string;
}

interface ActionTokenPayload {
  sub: string;
  type: ActionTokenType;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
    };
  }

  private issueTokenPair(user: User) {
    const payload: AccessRefreshPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: asExpiresIn(this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m')),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: asExpiresIn(this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d')),
    });
    return { accessToken, refreshToken };
  }

  private signActionToken(userId: string, type: ActionTokenType, expiresIn: string) {
    const payload: ActionTokenPayload = { sub: userId, type };
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: asExpiresIn(expiresIn),
    });
  }

  private verifyActionToken(token: string, expectedType: ActionTokenType): string {
    let payload: ActionTokenPayload;
    try {
      payload = this.jwtService.verify<ActionTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new InvalidOrExpiredTokenException();
    }
    if (payload.type !== expectedType) {
      throw new InvalidOrExpiredTokenException();
    }
    return payload.sub;
  }

  // Account is created and usable immediately - email verification is a
  // separate, optional, self-serve step from the profile page, not a
  // signup gate.
  async signup(name: string, email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new EmailAlreadyExistsException();

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await this.usersService.create({ name, email, passwordHash });

    const verifyToken = this.signActionToken(user.id, 'email_verify', '24h');
    void this.mailService.sendVerificationEmail(user.email, user.name, verifyToken);

    return { user: this.toPublicUser(user), ...this.issueTokenPair(user) };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new InvalidCredentialsException();

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) throw new InvalidCredentialsException();

    return { user: this.toPublicUser(user), ...this.issueTokenPair(user) };
  }

  async refresh(refreshToken: string) {
    let payload: AccessRefreshPayload;
    try {
      payload = this.jwtService.verify<AccessRefreshPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new InvalidOrExpiredTokenException('refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UserNotFoundException();

    return this.issueTokenPair(user);
  }

  async requestEmailVerification(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UserNotFoundException();
    if (user.isVerified) throw new EmailAlreadyVerifiedException();

    const token = this.signActionToken(user.id, 'email_verify', '24h');
    await this.mailService.sendVerificationEmail(user.email, user.name, token);
  }

  async verifyEmail(token: string) {
    const userId = this.verifyActionToken(token, 'email_verify');
    const user = await this.usersService.findById(userId);
    if (!user) throw new UserNotFoundException();

    if (!user.isVerified) {
      await this.usersService.markVerified(userId);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    // Don't reveal whether the email exists - just no-op silently.
    if (!user) return;

    const token = this.signActionToken(user.id, 'password_reset', '1h');
    await this.mailService.sendPasswordResetEmail(user.email, user.name, token);
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = this.verifyActionToken(token, 'password_reset');
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.usersService.updatePassword(userId, passwordHash);
  }
}
