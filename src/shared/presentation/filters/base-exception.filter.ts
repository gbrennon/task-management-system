import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NotFoundError } from '@shared/domain/errors/not-found.error';
import { ConflictError } from '@shared/domain/errors/conflict.error';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  private readonly customErrorMap = new Map<Function, HttpStatus>([
    [NotFoundError, HttpStatus.NOT_FOUND],
    [ConflictError, HttpStatus.CONFLICT],
    // Add more custom errors here
  ]);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500
    let errorResponse: { statusCode: number; error: string; message: string };

    if (exception instanceof HttpException) {
      // Handle NestJS built-in HttpException
      status = exception.getStatus();
      const errorDetails = exception.getResponse();

      errorResponse =
        typeof errorDetails === 'string'
          ? { statusCode: status, error: 'HttpException', message: errorDetails }
          : {
              statusCode: status,
              error: 'HttpException',
              message: (errorDetails as any).message || 'An error occurred',
            };
    } else {
      // Check for custom errors
      const customStatus = this.customErrorMap.get(exception.constructor);
      if (customStatus) {
        status = customStatus;
        errorResponse = {
          statusCode: status,
          error: exception.name,
          message: exception.message,
        };
      } else {
        // General error handling for unknown exceptions
        errorResponse = {
          statusCode: status,
          error: exception.name || 'InternalServerError',
          message: exception.message || 'Internal server error',
        };
      }
    }

    response.status(status).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
