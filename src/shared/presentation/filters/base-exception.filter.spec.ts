import { BaseExceptionFilter } from './base-exception.filter';
import { NotFoundError } from '@shared/domain/errors/not-found.error';
import { ConflictError } from '@shared/domain/errors/conflict.error';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('BaseExceptionFilter', () => {
  let filter: BaseExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new BaseExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test-url',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle HttpException and send proper response', () => {
    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Bad Request',
    });
  });

  it('should handle NotFoundError and send proper response', () => {
    const exception = new NotFoundError('Resource not found');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Resource not found',
    });
  });

  it('should handle ConflictError and send proper response', () => {
    const exception = new ConflictError('Conflict occurred');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Conflict occurred',
    });
  });

  it('should handle unknown error and send generic response', () => {
    const exception = new Error('Unknown error');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Unknown error',
    });
  });

  it('should handle error without message and send generic response', () => {
    const exception = new Error();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'An unexpected error occurred',
    });
  });
});
