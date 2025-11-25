import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: Record<string, string> = {};

  console.error('ERROR LOG:', err);

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    err.errors.forEach((e) => {
      if (e.path) {
        details[e.path] = e.message;
      }
    });
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    message: message,
    details: details,
  });
};
