import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import {
  CreateTaskService
} from '../../application/create-task/create-task.service';
import { CreateTaskRequestDto } from '../dtos/create-task-request.dto';
import { CreateTaskResponseDto } from '../dtos/create-task-response.dto';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';

@Controller('/tasks')
export class CreateTaskController {
  constructor(
    private readonly createTaskService: CreateTaskService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Req() request: any,
    @Body() dto: CreateTaskRequestDto
  ): Promise<CreateTaskResponseDto> {
    const userId = request.user.userId;
    const input = {
      ...dto,
      ownerId: userId
    }
    const output = await this.createTaskService.execute(input);

    return { id: output.id };
  }
}
