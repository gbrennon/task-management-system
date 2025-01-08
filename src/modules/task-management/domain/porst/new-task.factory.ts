import { Task } from "../entities/task";

export interface NewTaskInput {
  title: string;
  description: string;
  ownerId: string;
}

export interface NewTaskFactory {
  create(input: NewTaskInput): Task;
}
