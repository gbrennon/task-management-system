export class TaskStatus {
  public constructor(
    public readonly value: string
  ) {}

  public static readonly TODO = new TaskStatus('TODO');
  public static readonly IN_PROGRESS = new TaskStatus('IN_PROGRESS');
  public static readonly DONE = new TaskStatus('DONE');
}
