import { v4 as uuidv4 } from 'uuid';

import { Task } from "@task-management/domain/entities/task";
import { NewTaskInput } from "@task-management/domain/ports/new-task.factory";
import { TaskStatus, TaskStatusEnum } from '@task-management/domain/value-objects/task-status';


export class NewTaskFactory implements NewTaskFactory {
  create(input: NewTaskInput): Task {
    const id = uuidv4();
    const todoStatus = new TaskStatus(TaskStatusEnum.TODO);

    return new Task(
      id,
      input.title,
      input.description,
      todoStatus,
      input.ownerId
    );
  }
}
