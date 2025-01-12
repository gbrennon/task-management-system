import { UnauthorizedException } from "@nestjs/common";

export class TokenNotProvidedException extends UnauthorizedException {
  constructor() {
    super('Token not provided or malformed');
  }
}
