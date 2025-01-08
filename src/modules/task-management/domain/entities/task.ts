import {
  TaskStatusAlreadySetError
} from "../errors/task-status-already-set.error";
import { TaskStatus } from "../value-objects/task-status";

export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TaskStatus,
    public readonly ownerId: string
  ) {}

  public changeStatus(newStatus: TaskStatus): Task {
    if (this.status === newStatus) {
      throw new TaskStatusAlreadySetError(newStatus.value);
    }

    return new Task(
      this.id,
      this.title,
      this.description,
      newStatus,
      this.ownerId
    );
  }
}
