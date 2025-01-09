import { Module } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import TaskEntity from './infrastructure/entities/task.entity';
import { CreateTaskController } from './presentation/controllers/create-task.controller';
import { CreateTaskService } from './application/create-task/create-task.service';
import { NewTaskFactory } from './infrastructure/factories/new-task/uuid-new-task.factory';
import { TypeORMTaskRepository } from './infrastructure/repositories/task/type-orm-task.repository';
import { TaskDomainSchemaMapper } from './infrastructure/mappers/task-domain-schema-mapper/task-domain-schema.mapper';
import { TaskSchemaDomainMapper } from './infrastructure/mappers/task-schema-domain-mapper/task-schema-domain.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity])
  ],
  controllers: [CreateTaskController],
  providers: [{
    provide: CreateTaskService,
    useFactory(entityManager: EntityManager) {
      const taskFactory = new NewTaskFactory();
      const taskRepository = new TypeORMTaskRepository(
        entityManager,
        new TaskDomainSchemaMapper(),
        new TaskSchemaDomainMapper()
      );
      return new CreateTaskService(taskFactory, taskRepository);
    },
    inject: [EntityManager]
  }]
})
export class TaskManagementModule {}
