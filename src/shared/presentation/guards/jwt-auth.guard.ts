import { 
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { authConfig } from '../../config/auth.config';
import { InvalidOrExpiredTokenException } from '../exceptions/invalid-or-expired-token.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // throw new UnauthorizedException('Token is missing or invalid');
      throw new InvalidOrExpiredTokenException();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: authConfig.accessToken.secret, // Use access token secret
      });

      // Attach decoded token to the request for use in controllers
      request.user = decodedToken;
      return true;
    } catch (error) {
      // throw new UnauthorizedException('Token is invalid or expired');
      throw new InvalidOrExpiredTokenException();
    }
  }
}
