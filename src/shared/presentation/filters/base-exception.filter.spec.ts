import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { NotFoundError } from '@shared/domain/errors/not-found.error';
import { ConflictError } from '@shared/domain/errors/conflict.error';
import { ArgumentsHost } from '@nestjs/common/interfaces';

describe('BaseExceptionFilter', () => {
  let exceptionFilter: BaseExceptionFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockRequest: { url: string };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    exceptionFilter = new BaseExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = { url: '/test' };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle a NotFoundError with 404 status', () => {
    const exception = new NotFoundError('Resource not found');

    exceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 404,
      error: 'NotFoundError',
      message: 'Resource not found',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle a ConflictError with 409 status', () => {
    const exception = new ConflictError('Resource conflict');

    exceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 409,
      error: 'ConflictError',
      message: 'Resource conflict',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle HttpException and use its status and message', () => {
    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    exceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'HttpException',
      message: 'Bad Request',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle unknown errors with 500 status', () => {
    const exception = new Error('Unexpected error');

    exceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      error: 'Error',
      message: 'Unexpected error',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle errors with no message and default to 500 status', () => {
    const exception = new Error();

    exceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      error: 'Error',
      message: 'Internal server error',
      timestamp: expect.any(String),
      path: '/test',
    });
  });
});
