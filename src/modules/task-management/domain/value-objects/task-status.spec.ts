import { InvalidTaskStatusError } from "../errors/invalid-task-status.error";
import { TaskStatus, TaskStatusEnum } from "./task-status";

describe('TaskStatus', () => {
  describe('equals', () => {
    it('should return true when values are equal', () => {
      const status = new TaskStatus(TaskStatusEnum.TODO);
      const otherStatus = new TaskStatus(TaskStatusEnum.TODO);

      const areEqual = status.equals(otherStatus);

      expect(areEqual).toBe(true);
    });

    it('should return false when values are different', () => {
      const status = new TaskStatus(TaskStatusEnum.TODO);
      const otherStatus = new TaskStatus(TaskStatusEnum.IN_PROGRESS);

      const areEqual = status.equals(otherStatus);

      expect(areEqual).toBe(false);
    });

    it('should return false when types are different', () => {
      const status = new TaskStatus(TaskStatusEnum.TODO);
      const otherStatus = { value: TaskStatusEnum.TODO } as TaskStatus;

      const areEqual = status.equals(otherStatus);

      expect(areEqual).toBe(false);
    });
  });

  describe('fromString', () => {
    it('should return TODO when value is "TODO"', () => {
      const stringStatus = 'TODO';

      const taskStatus = TaskStatus.fromString(stringStatus);

      const expectedTaskStatus = new TaskStatus(TaskStatusEnum.TODO);
      expect(taskStatus).toStrictEqual(expectedTaskStatus);
    });

    it('should return IN_PROGRESS when value is "IN_PROGRESS"', () => {
      const stringStatus = 'IN_PROGRESS';

      const taskStatus = TaskStatus.fromString(stringStatus);

      const expectedTaskStatus = new TaskStatus(TaskStatusEnum.IN_PROGRESS);
      expect(taskStatus).toStrictEqual(expectedTaskStatus);
    });

    it('should return DONE when value is "DONE"', () => {
      const stringStatus = 'DONE';

      const taskStatus = TaskStatus.fromString(stringStatus);

      const expectedTaskStatus = new TaskStatus(TaskStatusEnum.DONE);
      expect(taskStatus).toStrictEqual(expectedTaskStatus);
    });

    it('should throw an error when value is invalid', () => {
      const invalidStatus = 'INVALID';

      expect(() => {
        TaskStatus.fromString(invalidStatus);
      }).toThrow(new InvalidTaskStatusError(invalidStatus));
    });
  });
});
