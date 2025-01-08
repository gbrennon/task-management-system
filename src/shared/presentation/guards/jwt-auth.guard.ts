import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MissingAuthorizationHeaderException
} from '../exceptions/missing-authorization-header.exception';
import {
  InvalidOrExpiredTokenException
} from '../exceptions/invalid-or-expired-token.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // Implement the canActivate method manually
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer token"

    if (!token) {
      throw new MissingAuthorizationHeaderException();
    }

    try {
      // Decode and verify the JWT token
      const user = await this.jwtService.verifyAsync(token);

      // Attach the user to the request
      request.user = { userId: user?.sub }; // Assuming 'sub' contains the user ID

      return true; // Authorization successful
    } catch (err) {
      throw new InvalidOrExpiredTokenException();
    }
  }
}
