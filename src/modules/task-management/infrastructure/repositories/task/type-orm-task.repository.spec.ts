import { Task } from "@task-management/domain/entities/task";
import { TaskRepository } from "@task-management/domain/ports/task.repository";
import { DataSource, EntityManager } from "typeorm";
import { TaskDomainSchemaMapper } from "../../mappers/task-domain-schema-mapper/task-domain-schema.mapper";
import { TaskSchemaDomainMapper } from "../../mappers/task-schema-domain-mapper/task-schema-domain.mapper";
import { TypeORMTaskRepository } from "./type-orm-task.repository";
import { TaskStatus } from "@task-management/domain/value-objects/task-status";
import { AppDataSource } from "@shared/infrastructure/config/app-data-source";
import TaskEntity from "@task-management/infrastructure/entities/task.entity";

describe("TypeORMTaskRepository", () => {
  let repository: TaskRepository;
  let dataSource: DataSource;
  let entityManager: EntityManager;
  let taskDomainSchemaMapper: TaskDomainSchemaMapper;
  let taskSchemaDomainMapper: TaskSchemaDomainMapper;

  const taskId = "uuid123";
  const taskTitle = "Task title";
  const taskDescription = "Task description";
  const taskStatus = TaskStatus.TODO;
  const taskOwnerId = "1";

  const fakeTask = new Task(
    taskId,
    taskTitle,
    taskDescription,
    taskStatus,
    taskOwnerId
  );


  beforeEach(async () => {
    dataSource = AppDataSource;
    await dataSource.initialize();

    entityManager = dataSource.manager;
    taskDomainSchemaMapper = new TaskDomainSchemaMapper();
    taskSchemaDomainMapper = new TaskSchemaDomainMapper();

    repository = new TypeORMTaskRepository(
      entityManager,
      taskDomainSchemaMapper,
      taskSchemaDomainMapper
    );
  });

  afterEach(async () => {
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe("save", () => {
    it("should save a task", async () => {
      // Act
      await repository.save(fakeTask);

      // Assert
      const taskEntity = await dataSource.manager.findOne(TaskEntity, {
         where: {id: fakeTask.id}
      });
      expect(taskEntity).not.toBeNull();
      expect(taskEntity!.id).toBe(fakeTask.id);
      expect(taskEntity!.title).toBe(fakeTask.title);
      expect(taskEntity!.status).toBe(fakeTask.status.value);
    });
  });
});
