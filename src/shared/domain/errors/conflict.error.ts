import { BaseError } from './base.error';

export class ConflictError extends BaseError {
  constructor(
    message: string = 'Conflict occurred', 
    details?: Record<string, any>
  ) {
    super(message, details);
  }
}
