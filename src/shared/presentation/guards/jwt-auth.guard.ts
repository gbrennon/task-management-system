import { 
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '../../config/auth.config';
import { InvalidOrExpiredTokenException } from '../exceptions/invalid-or-expired-token.exception';
import { TokenNotProvidedException } from '../exceptions/token-not-provided.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new TokenNotProvidedException();
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
      throw new InvalidOrExpiredTokenException();
    }
  }
}
