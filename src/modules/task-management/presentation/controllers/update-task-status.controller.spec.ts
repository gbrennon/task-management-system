import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { UpdateTaskStatusController } from './update-task-status.controller';
import { UpdateTaskStatusService } from '@task-management/application/update-task-status/update-task-status.service';
import { TokenNotProvidedException } from '@shared/presentation/exceptions/token-not-provided.exception';
import { InvalidOrExpiredTokenException } from '@shared/presentation/exceptions/invalid-or-expired-token.exception';

describe('UpdateTaskStatusController (e2e)', () => {
  let app: INestApplication;
  let mockService: any;
  let jwtServiceMock: any;
  const taskId = '14ff9550-739c-4a04-bbb6-4fce14e1644f';
  const userId = 'c4c19235-0038-4188-b407-0c77888daf50';

  beforeAll(async () => {
    mockService = {
      execute: jest.fn(),
    };

    jwtServiceMock = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateTaskStatusController],
      providers: [
        {
          provide: UpdateTaskStatusService,
          useValue: mockService,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new JwtAuthGuard(jwtServiceMock))
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const validToken = 'valid-token';
  const expiredToken = 'expired-token';
  const malformedToken = 'malformed-token';

  beforeEach(() => {
    jwtServiceMock.verify.mockReset();
    mockService.execute.mockReset();
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app.getHttpServer())
      .put(`/tasks/${taskId}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(new TokenNotProvidedException().message);
  });

  it('should return 401 if the token is invalid or expired', async () => {
    jwtServiceMock.verify.mockImplementation(() => {
      throw new InvalidOrExpiredTokenException();
    });

    const response = await request(app.getHttpServer())
      .put(`/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({ status: 'IN_PROGRESS' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      new InvalidOrExpiredTokenException().message,
    );
  });

  it('should return 200 if a valid token is provided', async () => {
    jwtServiceMock.verify.mockReturnValue({ id: userId }); // Simulate a decoded token

    mockService.execute.mockResolvedValue({ success: true });

    const response = await request(app.getHttpServer())
      .put(`/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        status: 'IN_PROGRESS'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(mockService.execute).toHaveBeenCalledWith({
      id: taskId,
      ownerId: userId,
      status: 'IN_PROGRESS',
    });
  });
});
