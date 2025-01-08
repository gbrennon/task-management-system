import { CreateTaskService } from "@task-management/application/create-task/create-task.service";
import { CreateTaskController } from "./create-task.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import * as request from 'supertest';

describe('CreateTaskController', () => {
  let app: INestApplication;
  let service: jest.Mocked<CreateTaskService>;

  beforeEach(async () => {
    const mockService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateTaskController],
      providers: [
        {
          provide: CreateTaskService,
          useValue: mockService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();

    service = module.get<CreateTaskService>(
      CreateTaskService
    ) as jest.Mocked<CreateTaskService>;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return CreateTaskResponseDto on success', async () => {
    const validDto = {
      title: 'Task 1',
      description: 'Description 1',
      ownerId: '550e8400-e29b-41d4-a716-446655440000', // valid UUID
    };
    const mockResponse = {
      id: '123',
    };

    service.execute.mockResolvedValue(mockResponse);

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(validDto)
      .expect(201);

    expect(response.body).toEqual({ id: '123' });
    expect(service.execute).toHaveBeenCalledWith(validDto);
    expect(service.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException if validation fails', async () => {
    const invalidDto = {
      title: '', // Invalid title
      description: '', // Invalid description
      ownerId: '', // Invalid UUID
    };

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(invalidDto)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('title must be longer than or equal to 3 characters');
    expect(response.body.message).toContain('description must be longer than or equal to 3 characters');
    expect(response.body.message).toContain('ownerId must be a UUID');
  });
});
