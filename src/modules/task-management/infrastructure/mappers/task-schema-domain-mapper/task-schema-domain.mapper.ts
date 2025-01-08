import { Task } from "@task-management/domain/entities/task";
import { TaskStatus } from "@task-management/domain/value-objects/task-status";
import TaskEntity from "@task-management/infrastructure/entities/task.entity";


export class TaskSchemaDomainMapper {
  constructor() {}

  map(taskSchema: TaskEntity): Task {
    const status = new TaskStatus(taskSchema.status.value);

    return new Task(
      taskSchema.id,
      taskSchema.title,
      taskSchema.description,
      status,
      taskSchema.ownerId
    );
  }
}
