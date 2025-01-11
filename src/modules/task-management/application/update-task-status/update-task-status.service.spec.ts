import { TaskRepository } from "@task-management/domain/ports/task.repository";
import { UpdateTaskStatusService } from "./update-task-status.service";
import { Task } from "@task-management/domain/entities/task";
import { TaskStatus, TaskStatusEnum } from "@task-management/domain/value-objects/task-status";
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
    const status = new TaskStatus(TaskStatusEnum.TODO);
    const existingTask = new Task(
      "123",
      "Test Task",
      "Description",
      status,
      "owner-id"
    );
    const input = {
      id: existingTask.id,
      ownerId: existingTask.ownerId,
      status: TaskStatusEnum.DONE
    };

    when(taskRepository.findByIdAndOwnerId(
      input.id,
      input.ownerId
    )).thenResolve(existingTask);
    when(taskRepository.save(existingTask)).thenResolve();

    // Act
    const result = await service.execute(input);

    // Assert
    expect(result).toEqual({ id: "123" });
    expect(existingTask.status.value).toEqual(
      TaskStatusEnum.DONE
    ); // Verify status update
    verify(taskRepository.findByIdAndOwnerId(
      input.id,
      input.ownerId
    )).once();
    verify(taskRepository.save(existingTask)).once();
  });

  it("should throw TaskNotFoundError when task is not found", async () => {
    const input = {
      id: "nonexistent",
      ownerId: "noonexistent",
      status: TaskStatusEnum.DONE
    };

    when(taskRepository.findByIdAndOwnerId(
      input.id,
      input.ownerId
    )).thenResolve(null);

    await expect(service.execute(input)).rejects.toThrow(TaskNotFoundError);
    verify(taskRepository.findByIdAndOwnerId(
      input.id,
      input.ownerId
    )).once();
  });

  it("should throw TaskStatusAlreadySetError when task status is already set", async () => {
    const status = new TaskStatus(TaskStatusEnum.DONE);
    const existingTask = new Task(
      "123",
      "Test Task",
      "Description",
      status,
      "owner-id"
    );
    const input = {
      id: "123",
      ownerId: "owner-id",
      status: TaskStatusEnum.DONE
    };

    when(taskRepository.findByIdAndOwnerId(
      input.id,
      input.ownerId
    )).thenResolve(existingTask);

    await expect(service.execute(input)).rejects.toThrow(
      TaskStatusAlreadySetError
    );
    verify(taskRepository.findByIdAndOwnerId(
      input.id,
      input.ownerId
    )).once();
  });
});
