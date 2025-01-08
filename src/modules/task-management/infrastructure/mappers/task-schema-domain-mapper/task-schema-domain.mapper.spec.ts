import { TaskSchemaDomainMapper } from "./task-schema-domain.mapper";
import {
  TaskEntity
} from "@task-management/infrastructure/entities/task.entity";
import { Task } from "@task-management/domain/entities/task";

describe("TaskSchemaDomainMapper", () => {
  const mapper = new TaskSchemaDomainMapper();

  describe("map", () => {
    const taskEntity = new TaskEntity();
    taskEntity.id = "123";
    taskEntity.title = "Task title";
    taskEntity.description = "Task description";
    taskEntity.status = { value: "IN_PROGRESS" };
    taskEntity.ownerId = "1";

    it("should map a TaskEntity to a Task", () => {
      const task = mapper.map(taskEntity);

      const expectedTask = new Task(
        taskEntity.id,
        taskEntity.title,
        taskEntity.description,
        taskEntity.status,
        taskEntity.ownerId
      );
      expect(task).toEqual(expectedTask);
    });
  });
});
