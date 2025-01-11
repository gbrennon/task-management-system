import { TaskRepository } from "@task-management/domain/ports/task.repository";
import { UpdateTaskStatusService } from "./update-task-status.service";
import { Task } from "@task-management/domain/entities/task";
import { TaskStatus } from "@task-management/domain/value-objects/task-status";
import { TaskNotFoundError } from "@task-management/domain/errors/task-not-found.error";
import { TaskStatusAlreadySetError } from "@task-management/domain/errors/task-status-already-set.error";
import { instance, mock, when, verify } from "ts-mockito";

describe("UpdateTaskStatusService", () => {
  let taskRepository: TaskRepository;
  let service: UpdateTaskStatusService;

  beforeEach(() => {
    taskRepository = mock<TaskRepository>();
    service = new UpdateTaskStatusService(instance(taskRepository));
  });

  it("should update task status and return the task id", async () => {
    // Arrange: Use real Task object
    const existingTask = new Task(
      "123",
      "Test Task",
      "Description",
      TaskStatus.TODO,
      "owner-id"
    );
    const input = { id: "123", status: TaskStatus.DONE.value };

    when(taskRepository.findById(input.id)).thenResolve(existingTask);
    when(taskRepository.save(existingTask)).thenResolve();

    // Act
    const result = await service.execute(input);

    // Assert
    expect(result).toEqual({ id: "123" });
    expect(existingTask.status).toEqual(TaskStatus.DONE); // Verify status update
    verify(taskRepository.findById(input.id)).once();
    verify(taskRepository.save(existingTask)).once();
  });

  it("should throw TaskNotFoundError when task is not found", async () => {
    const input = { id: "nonexistent", status: TaskStatus.DONE.value };

    when(taskRepository.findById(input.id)).thenResolve(null);

    await expect(service.execute(input)).rejects.toThrow(TaskNotFoundError);
    verify(taskRepository.findById(input.id)).once();
  });

  it("should throw TaskStatusAlreadySetError when task status is already set", async () => {
    const existingTask = new Task(
      "123",
      "Test Task",
      "Description",
      TaskStatus.DONE,
      "owner-id"
    );
    const input = { id: "123", status: TaskStatus.DONE.value };

    when(taskRepository.findById(input.id)).thenResolve(existingTask);

    await expect(service.execute(input)).rejects.toThrow(
      TaskStatusAlreadySetError
    );
    verify(taskRepository.findById(input.id)).once();
  });
});

