import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidOrExpiredTokenException extends HttpException {
  constructor() {
    super('Invalid or expired token', HttpStatus.UNAUTHORIZED);
  }
}
