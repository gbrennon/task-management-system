import {
  NewTaskFactory
} from "modules/task-management/domain/ports/new-task.factory";
import {
  TaskRepository
} from "modules/task-management/domain/ports/task.repository";

export interface CreateTaskInput {
  title: string;
  description: string;
  ownerId: string;
}

export interface CreateTaskOutput {
  id: string;
}

export class CreateTaskService {
  constructor(
    public readonly newTaskFactory: NewTaskFactory,
    public readonly taskRepository: TaskRepository
  ) {}

  public async execute(input: CreateTaskInput): Promise<CreateTaskOutput> {
    const task = this.newTaskFactory.create(input);

    await this.taskRepository.save(task);

    return { id: task.id };
  }
}
