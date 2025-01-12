export class BaseError extends Error {
  public readonly name: string;

  constructor(
    public readonly message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Maintains the prototype chain
    this.name = this.constructor.name; // Sets the name of the error (e.g., "NotFoundError")
  }
}
