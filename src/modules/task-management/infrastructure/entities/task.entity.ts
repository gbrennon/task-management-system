import { Entity, PrimaryColumn, Column } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/entities/BaseEntity';

@Entity('tasks')
export default class TaskEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @Column()
  public status!: string;

  @Column()
  public ownerId!: string;
}
