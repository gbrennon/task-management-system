import { Task } from "@task-management/domain/entities/task";
import { TaskRepository } from "@task-management/domain/ports/task.repository";
import { TaskDomainSchemaMapper
} from "../../mappers/task-domain-schema-mapper/task-domain-schema.mapper";
import {
  TaskSchemaDomainMapper
} from "../../mappers/task-schema-domain-mapper/task-schema-domain.mapper";
import { EntityManager } from "typeorm";


export class TypeORMTaskRepository implements TaskRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly taskDomainSchemaMapper: TaskDomainSchemaMapper,
    private readonly taskSchemaDomainMapper: TaskSchemaDomainMapper
  ) {}

  async save(task: Task): Promise<void> {
    const taskEntity = this.taskDomainSchemaMapper.map(task);

    await this.entityManager.save(taskEntity);
  }
}
