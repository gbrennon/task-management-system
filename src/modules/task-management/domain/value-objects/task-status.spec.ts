import { InvalidTaskStatusError } from "../errors/invalid-task-status.error";
import { TaskStatus } from "./task-status";

describe('TaskStatus', () => {
  describe('fromString', () => {
    it('should return TODO when value is "TODO"', () => {
      const taskStatus = TaskStatus.fromString('TODO');
      expect(taskStatus).toBe(TaskStatus.TODO);
    });

    it('should return IN_PROGRESS when value is "IN_PROGRESS"', () => {
      const taskStatus = TaskStatus.fromString('IN_PROGRESS');
      expect(taskStatus).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should return DONE when value is "DONE"', () => {
      const taskStatus = TaskStatus.fromString('DONE');
      expect(taskStatus).toBe(TaskStatus.DONE);
    });

    it('should throw an error when value is invalid', () => {
      expect(() => {
        TaskStatus.fromString('INVALID');
      }).toThrow(new InvalidTaskStatusError('INVALID'));
    });
  });
});
