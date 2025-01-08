import { HttpException, HttpStatus } from "@nestjs/common";

export class MissingAuthorizationHeaderException extends HttpException {
  constructor() {
    super('Authorization header is missing', HttpStatus.UNAUTHORIZED);
  }
}
