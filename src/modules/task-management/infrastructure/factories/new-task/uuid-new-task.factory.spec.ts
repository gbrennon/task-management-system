import { Task } from "@task-management/domain/entities/task";
import { TaskStatus, TaskStatusEnum } from "@task-management/domain/value-objects/task-status";
import { NewTaskFactory } from "./uuid-new-task.factory";
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('NewTaskFactory', () => {
  let factory: NewTaskFactory;

  beforeEach(() => {
    factory = new NewTaskFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task with an UUID', () => {
      // Arrange
      const mockUuid = 'generated-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
      const title = 'Task 1';
      const description = 'Description 1';
      const ownerId = '1';

      // Act
      const actualTask = factory.create({
        title,
        description,
        ownerId
      });

      // Assert
      const expectedTask = new Task(
        mockUuid,
        title,
        description,
        new TaskStatus(TaskStatusEnum.TODO),
        ownerId
      );
      expect(actualTask).toEqual(expectedTask);
    });
  });
});
