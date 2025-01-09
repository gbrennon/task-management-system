import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateTaskController } from './create-task.controller';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { CreateTaskService } from '../../application/create-task/create-task.service';
import { INestApplication } from '@nestjs/common';
import { InvalidOrExpiredTokenException } from '@shared/presentation/exceptions/invalid-or-expired-token.exception';
import { TokenNotProvidedException } from '@shared/presentation/exceptions/token-not-provided.exception';
import { ValidationPipe } from '@nestjs/common';

describe('CreateTaskController', () => {
  let app: INestApplication;
  let taskService: CreateTaskService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateTaskController],
      providers: [
        {
          provide: CreateTaskService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest();
          const authHeader = request.headers.authorization;

          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new TokenNotProvidedException();
          }

          const token = authHeader.split(' ')[1];

          if (token !== 'valid_token') {
            throw new InvalidOrExpiredTokenException();
          }

          request.user = { id: '123' };
          return true;
        }),
      })
      .compile();

    app = module.createNestApplication();

    // Add the validation pipe here
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove extra fields automatically
        forbidNonWhitelisted: true, // Reject extra fields
      }),
    );

    await app.init();
    taskService = module.get<CreateTaskService>(CreateTaskService);
  });

  it('should create a task successfully when authorized', async () => {
    const createTaskDto = { title: 'Test Task', description: 'Test description' };
    const createdTask = { id: '1' };

    // Mock the service's execute method
    const executeSpy = jest.spyOn(taskService, 'execute').mockResolvedValue(createdTask);

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer valid_token') // Provide a valid token
      .send(createTaskDto)
      .expect(201);

    expect(response.body).toEqual({ id: '1' });

    // Verify the service is called with the correct input, including the user ID
    expect(executeSpy).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test description',
      ownerId: '123', // This must match the mocked userId
    });
  });

  it('should reject requests without an authorization token', async () => {
    const createTaskDto = { title: 'Test Task', description: 'Test description' };

    await request(app.getHttpServer())
      .post('/tasks') // No Authorization header
      .send(createTaskDto)
      .expect(401) // Unauthorized status code
      .then((response) => {
        // Optionally, verify the structure if your exception format is consistent
        expect(response.body).toHaveProperty('statusCode', 401);
        expect(response.body).toHaveProperty('error', 'Unauthorized');
      });
  });

  it('should reject requests with an invalid authorization token', async () => {
    const createTaskDto = { title: 'Test Task', description: 'Test description' };

    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer invalid_token') // Provide an invalid token
      .send(createTaskDto)
      .expect(401) // Unauthorized status code
      .then((response) => {
        expect(response.body).toHaveProperty('statusCode', 401);
        expect(response.body).toHaveProperty('error', 'Unauthorized');
      });
  });

  it('should fail validation for missing title', async () => {
    const createTaskDto = { description: 'Test description' };

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer valid_token') // Provide a valid token
      .send(createTaskDto)
      .expect(400);

    expect(response.body.message).toContain('title is required');
  });

  it('should fail validation for extra fields', async () => {
    const createTaskDto = {
      title: 'Test Task',
      description: 'Test description',
      extraField: 'extra',
    };

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer valid_token') // Provide a valid token
      .send(createTaskDto)
      .expect(400);

    expect(response.body.message).toContain('property extraField should not exist');
  });

  afterAll(async () => {
    await app.close();
  });
});
