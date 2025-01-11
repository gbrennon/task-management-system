import { TaskStatusAlreadySetError } from "../errors/task-status-already-set.error";
import { TaskStatus } from "../value-objects/task-status";
import { Task } from "./task";

describe('Task', () => {
  describe('changeStatus', () => {
    it('should change the status of the task', () => {
      // Arrange
      const task = new Task('1', 'Task 1', 'Description 1', TaskStatus.TODO, '1');
      const newStatus = TaskStatus.IN_PROGRESS;

      // Act
      task.changeStatus(newStatus);

      // Assert
      expect(task.status).toBe(newStatus);
    });

    it('should throw an error if the status is the same', () => {
      // Arrange
      const task = new Task('1', 'Task 1', 'Description 1', TaskStatus.TODO, '1');
      const newStatus = TaskStatus.TODO;

      // Act
      const changeStatus = () => task.changeStatus(newStatus);

      // Assert
      expect(changeStatus).toThrow(
        new TaskStatusAlreadySetError(newStatus.value)
      );
    });
  });
});
