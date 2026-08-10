import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorBody {
  code?: string;
  message?: string | string[];
}

// Catches every exception thrown anywhere in the app and formats it into the
// standard { success: false, error: { code, message } } response shape.
// Unexpected (non-HttpException) errors are logged with full detail but only
// ever return a generic message to the client - never leak internals.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse() as ErrorBody | string;

      const code =
        typeof body === 'object' && body.code
          ? body.code
          : this.defaultCodeFor(status);

      // class-validator ValidationPipe errors land here as string[] under `message`.
      const message =
        typeof body === 'string'
          ? body
          : Array.isArray(body.message)
            ? body.message.join('; ')
            : (body.message ?? exception.message);

      response.status(status).json({ success: false, error: { code, message } });
      return;
    }

    this.logger.error(
      exception instanceof Error ? exception.stack : exception,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
    });
  }

  private defaultCodeFor(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'VALIDATION_ERROR';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMITED';
      default:
        return 'ERROR';
    }
  }
}
