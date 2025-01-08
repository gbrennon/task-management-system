import { deepEqual, instance, mock, verify, when } from "ts-mockito";
import { CreateTaskService } from "./create-task.service";
import { NewTaskFactory } from "@task-management/domain/ports/new-task.factory";
import { TaskRepository } from "@task-management/domain/ports/task.repository";
import { TaskStatus } from "@task-management/domain/value-objects/task-status";
import { Task } from "@task-management/domain/entities/task";

describe('CreateTaskService', () => {
  let newTaskFactory: NewTaskFactory;
  let taskRepository: TaskRepository;
  let createTaskService: CreateTaskService;

  beforeEach(() => {
    newTaskFactory = mock<NewTaskFactory>();
    taskRepository = mock<TaskRepository>();

    createTaskService = new CreateTaskService(
      instance(newTaskFactory),
      instance(taskRepository)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should create a new task', async () => {
      // Arrange
      const input = {
        title: 'Task 1',
        description: 'Description 1',
        ownerId: '1',
      };
      const fakeTask = new Task(
        'task-id',
        input.title,
        input.description,
        TaskStatus.TODO,
        input.ownerId
      );
      when(newTaskFactory.create(deepEqual(input))).thenReturn(fakeTask); // Mock create method
      when(taskRepository.save(fakeTask)).thenResolve();

      // Act
      await createTaskService.execute(input);

      // Assert
      verify(newTaskFactory.create(deepEqual(input))).once(); // Ensure it was called once
      verify(taskRepository.save(fakeTask)).once(); // Ensure save was called once
    });

    it('should return { id: task.id }', async () => {
      // Arrange
      const input = {
        title: 'Task 1',
        description: 'Description 1',
        ownerId: '1',
      };
      const fakeTask = new Task(
        'task-id',
        input.title,
        input.description,
        TaskStatus.TODO,
        input.ownerId
      );
      when(newTaskFactory.create(deepEqual(input))).thenReturn(fakeTask);
      when(taskRepository.save(fakeTask)).thenResolve();

      // Act
      const result = await createTaskService.execute(input);

      // Assert
      const expectedResult = { id: 'task-id' };
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if the task is not saved', async () => {
      // Arrange
      const input = {
        title: 'Task 1',
        description: 'Description 1',
        ownerId: '1',
      };
      const fakeTask = new Task(
        'task-id',
        input.title,
        input.description,
        TaskStatus.TODO,
        input.ownerId
      );
      when(newTaskFactory.create(deepEqual(input))).thenReturn(fakeTask);
      when(taskRepository.save(fakeTask)).thenReject(new Error('Error'));

      // Act & Assert
      await expect(createTaskService.execute(input)).rejects.toThrow('Error');
    });
  });
});

