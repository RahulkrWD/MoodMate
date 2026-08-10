import { HttpException, HttpStatus } from '@nestjs/common';

// Base for all domain-specific exceptions. Carries a machine-readable `code`
// (e.g. "INVALID_CREDENTIALS") alongside the human-readable message, so the
// frontend can branch on `error.code` instead of parsing message strings.
export class AppException extends HttpException {
  constructor(code: string, message: string, statusCode: HttpStatus) {
    super({ code, message }, statusCode);
  }
}
