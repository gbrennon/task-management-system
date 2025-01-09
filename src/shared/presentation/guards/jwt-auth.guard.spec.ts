import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { InvalidOrExpiredTokenException } from '../exceptions/invalid-or-expired-token.exception';
import { TokenNotProvidedException } from '../exceptions/token-not-provided.exception';

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
            verify: jest.fn(), // Mock the verify function
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

  it('should attach the user to the request when the token is valid', async () => {
    const mockUser = { sub: '123' }; // Example decoded token
    const mockRequest = { headers: { authorization: 'Bearer valid-token' }, user: null };

    // Simulate successful token verification
    jwtService.verify = jest.fn().mockReturnValue(mockUser);

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockUser); // Ensure the user is attached to the request
  });

  it('should throw TokenNotProvidedException when the token is missing', async () => {
    const mockRequest = { headers: {} }; // No Authorization header

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      TokenNotProvidedException
    );
  });

  it('should throw TokenNotProvidedException when the token is malformed', async () => {
    const mockRequest = { headers: { authorization: 'MalformedToken' } }; // Malformed Authorization header

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      TokenNotProvidedException
    );
  });

  it('should throw InvalidOrExpiredTokenException when the token is invalid or expired', async () => {
    const mockRequest = { headers: { authorization: 'Bearer invalid-token' } };

    // Simulate token verification failure
    jwtService.verify = jest.fn(() => {
      throw new Error('Invalid token');
    });

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
