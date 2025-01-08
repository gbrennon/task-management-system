import { Task } from "../entities/task";

export interface TaskRepository {
  save(task: Task): Promise<void>;
}
