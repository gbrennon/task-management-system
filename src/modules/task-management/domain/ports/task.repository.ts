import { Task } from "../entities/task";

export interface TaskRepository {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findByIdAndOwnerId(id: string, ownerId: string): Promise<Task | null>;
}
