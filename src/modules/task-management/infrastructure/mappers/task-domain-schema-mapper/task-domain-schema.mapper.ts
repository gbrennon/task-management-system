import { Task } from "@task-management/domain/entities/task";
import TaskEntity from "@task-management/infrastructure/entities/task.entity";


export class TaskDomainSchemaMapper {
  constructor() {}

  map(task: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = task.id;
    entity.title = task.title;
    entity.description = task.description;
    entity.status = task.status.value;
    entity.ownerId = task.ownerId;

    return entity;
  }
}
