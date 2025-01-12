import { ConflictError } from "@shared/domain/errors/conflict.error";

export class TaskStatusAlreadySetError extends ConflictError {
  constructor(status: string) {
    super(`Task status is already ${status}`);
  }
}
