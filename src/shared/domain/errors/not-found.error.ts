import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(
    message: string = 'Resource not found',
    details?: Record<string, any>,
  ) {
    super(message, details);
  }
}
