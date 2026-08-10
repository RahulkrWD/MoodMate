import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    this.frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    // SMTP isn't required for local dev - signup/login must never depend on
    // it, so a missing config just logs instead of throwing.
    if (!this.config.get('SMTP_USER') || !this.config.get('SMTP_PASS')) {
      this.logger.warn(
        `SMTP not configured - printing email instead of sending.\nTo: ${to}\nSubject: ${subject}\n${html}`,
      );
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_USER'),
        to,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error}`);
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const link = `${this.frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
    await this.send(
      to,
      'Verify your MoodMate email',
      `<p>Hi ${escapeHtml(name)},</p>
       <p>Click below to verify your email on MoodMate. This link expires in 24 hours.</p>
       <p><a href="${link}">Verify my email</a></p>`,
    );
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const link = `${this.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
    await this.send(
      to,
      'Reset your MoodMate password',
      `<p>Hi ${escapeHtml(name)},</p>
       <p>Click below to reset your password. This link expires in 1 hour. If you didn't request this, ignore this email.</p>
       <p><a href="${link}">Reset my password</a></p>`,
    );
  }
}
