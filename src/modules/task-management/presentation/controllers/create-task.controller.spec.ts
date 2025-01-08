import * as request from 'supertest';
import { CreateTaskService } from '@task-management/application/create-task/create-task.service';
import { CreateTaskController } from './create-task.controller';
import { CreateTaskRequestDto } from '../dtos/create-task-request.dto';
import { CreateTaskResponseDto } from '../dtos/create-task-response.dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateTaskController', () => {
  let service: CreateTaskService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateTaskController],
      providers: [CreateTaskService],
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

    service = module.get<CreateTaskService>(CreateTaskService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('handle', () => {
    it('should return CreateTaskResponseDto on success', async () => {
      const validDto: CreateTaskRequestDto = {
        title: 'Task 1',
        description: 'Description 1',
        ownerId: 'f2fff90c-33ef-45d2-bfde-871d662a355c', // valid UUID
      };
      const mockResponse: CreateTaskResponseDto = { id: '123' };

      // Spy on the execute method and mock the response
      jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

      // Send request using supertest
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(validDto)
        .expect(201); // Expect HTTP status 201 (Created)

      expect(response.body).toEqual(mockResponse); // Verify the response matches
      expect(service.execute).toHaveBeenCalledWith(validDto); // Ensure the mock method was called with correct args
    });

    it('should throw BadRequestException if validation fails', async () => {
      const invalidDto: CreateTaskRequestDto = {
        title: '',
        description: '',
        ownerId: '',
      };

      // Send request with invalid DTO and expect HTTP status 400 (Bad Request)
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(invalidDto)
        .expect(400); // Expecting a Bad Request response due to validation failure

      // Ensure validation error messages are correct
      expect(response.body.message).toContain('title should not be empty');
      expect(response.body.message).toContain('description should not be empty');
      expect(response.body.message).toContain('ownerId must be a UUID');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
