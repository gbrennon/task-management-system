import { Task } from "@task-management/domain/entities/task";
import { TaskNotFoundError } from "@task-management/domain/errors/task-not-found.error";
import { TaskRepository } from "@task-management/domain/ports/task.repository";
import { TaskStatus } from "@task-management/domain/value-objects/task-status";

export interface UpdateTaskStatusInput {
  id: string;
  ownerId: string;
  status: string;
}

interface UpdateTaskStatusOutput {
  id: string;
}

export class UpdateTaskStatusService {
  constructor(
    public readonly taskRepository: TaskRepository
  ) {}

  public async execute(
    input: UpdateTaskStatusInput
  ): Promise<UpdateTaskStatusOutput> {
    const task = await this.taskRepository.findByIdAndOwnerId(
      input.id,
      input.ownerId
    );

    if (!task) {
      throw new TaskNotFoundError(input.id);
    }

    this.updateTaskStatus(task, input.status);

    await this.taskRepository.save(task);

    return { id: task.id };
  }

  private updateTaskStatus(task: Task, status: string): void {
    const taskStatus = TaskStatus.fromString(status);

    task.changeStatus(taskStatus);
  }
}
