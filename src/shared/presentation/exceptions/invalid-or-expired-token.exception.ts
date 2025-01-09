import { UnauthorizedException } from "@nestjs/common";

export class InvalidOrExpiredTokenException extends UnauthorizedException {
  constructor() {
    super('Token is invalid or has expired');
  }
}
