export class InvalidTaskStatusError extends Error {
  constructor(status: string) {
    super(`Invalid task status "${status}"`);
  }
}
