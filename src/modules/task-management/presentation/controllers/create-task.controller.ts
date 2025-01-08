import { Controller, Post, Body } from '@nestjs/common';
import {
  CreateTaskService
} from '../../application/create-task/create-task.service';
import { CreateTaskRequestDto } from '../dtos/create-task-request.dto';
import { CreateTaskResponseDto } from '../dtos/create-task-response.dto';

@Controller('/tasks')
export class CreateTaskController {
  constructor(
    private readonly createTaskService: CreateTaskService
  ) {}

  @Post()
  async handle(
    @Body() dto: CreateTaskRequestDto
  ): Promise<CreateTaskResponseDto> {
    const output = await this.createTaskService.execute(dto);

    return { id: output.id };
  }
}
