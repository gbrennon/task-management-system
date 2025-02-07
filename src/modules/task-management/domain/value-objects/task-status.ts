import { InvalidTaskStatusError } from "../errors/invalid-task-status.error";

export enum TaskStatusEnum {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export class TaskStatus {
  public constructor(
    public readonly value: string
  ) {}

  public equals(other: unknown): boolean {
    if (!(other instanceof TaskStatus)) {
      return false;
    }
    return this.value === other.value;
  }

  public static fromString(value: string): TaskStatus {
    if (!Object.values(TaskStatusEnum).includes(value as TaskStatusEnum)) {
      throw new InvalidTaskStatusError(value);
    }

    return new TaskStatus(value);
  }
}
