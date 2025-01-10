import { InvalidTaskStatusError } from "../errors/invalid-task-status.error";

export class TaskStatus {
  public constructor(
    public readonly value: string
  ) {}

  public static readonly TODO = new TaskStatus('TODO');
  public static readonly IN_PROGRESS = new TaskStatus('IN_PROGRESS');
  public static readonly DONE = new TaskStatus('DONE');

  public static fromString(value: string): TaskStatus {
    switch(value) {
      case TaskStatus.TODO.value:
        return TaskStatus.TODO;
      case TaskStatus.IN_PROGRESS.value:
        return TaskStatus.IN_PROGRESS;
      case TaskStatus.DONE.value:
        return TaskStatus.DONE;
      default:
        throw new InvalidTaskStatusError(value);
    }
  }
}
