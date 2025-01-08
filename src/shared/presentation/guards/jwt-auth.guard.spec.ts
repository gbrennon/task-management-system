import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { InvalidOrExpiredTokenException } from '../exceptions/invalid-or-expired-token.exception';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should attach the user to the request', async () => {
    const mockUser = { sub: '123' }; // Assuming 'sub' is the user identifier

    // Simulate the behavior of JwtService's verifyAsync method
    jwtService.verifyAsync = jest.fn().mockResolvedValue(mockUser);

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: { authorization: 'Bearer token' } }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockExecutionContext);
    
    expect(result).toBe(true);
    expect(mockExecutionContext.switchToHttp().getRequest().user).toEqual({ userId: '123' });
  });

  it('should throw InvalidOrExpiredTokenException if token is invalid', async () => {
    // Simulate an invalid token
    jwtService.verifyAsync = jest.fn().mockRejectedValue(new Error('Invalid token'));

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: { authorization: 'Bearer invalid-token' } }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
     InvalidOrExpiredTokenException
    );
  });
});

