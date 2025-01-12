import { TaskStatusAlreadySetError } from "../errors/task-status-already-set.error";
import { TaskStatus, TaskStatusEnum } from "../value-objects/task-status";
import { Task } from "./task";

describe('Task', () => {
  describe('changeStatus', () => {
    it('should change the status of the task', () => {
      // Arrange
      const todoStatus = new TaskStatus(TaskStatusEnum.TODO);
      const task = new Task('1', 'Task 1', 'Description 1', todoStatus, '1');
      const newStatus = new TaskStatus(TaskStatusEnum.IN_PROGRESS);

      // Act
      task.changeStatus(newStatus);

      // Assert
      expect(task.status).toBe(newStatus);
    });

    it('should throw an error if the status is the same', () => {
      // Arrange
      const todoStatus = new TaskStatus(TaskStatusEnum.TODO);
      const task = new Task('1', 'Task 1', 'Description 1', todoStatus, '1');
      const newStatus = new TaskStatus(TaskStatusEnum.TODO);

      // Act
      const changeStatus = () => task.changeStatus(newStatus);

      // Assert
      expect(changeStatus).toThrow(
        new TaskStatusAlreadySetError(newStatus.value)
      );
    });
  });
});
