import { Entity, PrimaryColumn, Column } from 'typeorm';
import { TaskStatus } from '../../domain/value-objects/task-status';
import { BaseEntity } from '@shared/infrastructure/entities/BaseEntity';

@Entity('tasks')
export default class TaskEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @Column(() => TaskStatus) // Assuming TaskStatus is a value object stored as a JSON field
  public status!: TaskStatus;

  @Column()
  public ownerId!: string;
}
