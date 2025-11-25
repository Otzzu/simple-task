export class AppError extends Error {
  public statusCode: number;
  public details: Record<string, string>;

  constructor(message: string, statusCode: number, details: Record<string, string> = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
