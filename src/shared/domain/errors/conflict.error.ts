export class ConflictError extends Error {
  public readonly name: string;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
