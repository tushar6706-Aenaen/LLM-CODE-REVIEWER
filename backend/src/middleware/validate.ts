import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { CustomError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        const validationError = new CustomError('Validation failed', 400);
        (validationError as any).details = errorMessages;
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};

