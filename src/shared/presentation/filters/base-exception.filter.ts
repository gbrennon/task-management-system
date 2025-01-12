import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { NotFoundError } from '@shared/domain/errors/not-found.error';
import { ConflictError } from '@shared/domain/errors/conflict.error';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  private readonly customErrorMap: Map<Function, HttpStatus> = new Map<Function, HttpStatus>([
    [NotFoundError, HttpStatus.NOT_FOUND],
    [ConflictError, HttpStatus.CONFLICT],
  ]);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // Explicitly typed as Express Response
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : this.customErrorMap.get(
          exception.constructor
        ) || HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || 'An unexpected error occurred';

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any)['message'] || 'An error occurred',
    });
  }
}
