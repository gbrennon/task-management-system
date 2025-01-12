import { IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import {
  TaskStatusEnum
} from '@task-management/domain/value-objects/task-status';

export class UpdateTaskStatusRequestDto {
  @IsEnum(TaskStatusEnum, { message: 'status must be a valid task status enum value' })
  @IsNotEmpty({ message: 'status must not be empty' }) // Optional: if you want to ensure the status is provided
  status: TaskStatusEnum;  // Use TaskStatusEnum type for better type safety
}
