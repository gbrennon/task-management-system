import { NotFoundError } from "@shared/domain/errors/not-found.error";

export class TaskNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Task with id "${id}" not found`);
  }
}
