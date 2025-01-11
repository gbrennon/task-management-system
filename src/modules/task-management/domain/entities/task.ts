import {
  TaskStatusAlreadySetError
} from "../errors/task-status-already-set.error";
import { TaskStatus } from "../value-objects/task-status";

export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public status: TaskStatus,
    public readonly ownerId: string
  ) {}

  public changeStatus(newStatus: TaskStatus): void {
    if (this.status.equals(newStatus)) {
      throw new TaskStatusAlreadySetError(newStatus.value);
    }

    this.status = newStatus;
  }
}
