import { TaskDomainSchemaMapper } from "./task-domain-schema.mapper";
import { Task } from "@task-management/domain/entities/task";
import { TaskStatus } from "@task-management/domain/value-objects/task-status";

describe("TaskSchemaDomainMapper", () => {
  const mapper = new TaskDomainSchemaMapper();

  describe("map", () => {
    const task = new Task(
      "123",
      "Task title",
      "Task description",
      new TaskStatus("IN_PROGRESS"),
      "1"
    );

    it("should map a Task to a TaskEntity", () => {
      const taskEntity = mapper.map(task);

      expect(taskEntity.id).toBe(task.id);
      expect(taskEntity.title).toBe(task.title);
      expect(taskEntity.description).toBe(task.description);
      expect(taskEntity.status).toBe(task.status.value);
      expect(taskEntity.ownerId).toBe(task.ownerId);
    });
  });
});
