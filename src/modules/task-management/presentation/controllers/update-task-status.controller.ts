import { Body, Controller, Param, Put, Req, UseGuards } from "@nestjs/common";
import {
  UpdateTaskStatusService
} from "@task-management/application/update-task-status/update-task-status.service";
import { UpdateTaskStatusRequestDto } from "../dtos/update-task-status-request.dto";
import { UpdateTaskStatusResponseDto } from "../dtos/update-task-status-response.dto";
import { JwtAuthGuard } from "@shared/presentation/guards/jwt-auth.guard";

@Controller('tasks/:taskId/status')
export class UpdateTaskStatusController {
  constructor(
    private readonly updateTaskStatusService: UpdateTaskStatusService
  ) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Req() request: any,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskStatusRequestDto
  ): Promise<UpdateTaskStatusResponseDto> {
    const userId = request.user.id;

    const result = await this.updateTaskStatusService.execute({
      id: taskId,
      ownerId: userId,
      status: dto.status
    });

    return result;
  }
}
