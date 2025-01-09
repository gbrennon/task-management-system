import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
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
            verify: jest.fn(), // Use `verify` to match the implementation
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
    const mockRequest = { headers: { authorization: 'Bearer token' }, user: null };

    // Simulate successful token verification
    jwtService.verify = jest.fn().mockReturnValue(mockUser);

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockUser); // Attach the user to the request
  });

  it('should throw InvalidOrExpiredTokenException if token is invalid', async () => {
    // Simulate token verification failure
    jwtService.verify = jest.fn(() => {
      throw new Error('Invalid token');
    });

    const mockRequest = { headers: { authorization: 'Bearer invalid-token' } };

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      InvalidOrExpiredTokenException
    );
  });
});
