import { Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export const errorHandler = (err: ApiError,req: Request,res: Response ) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const data = err.data || null

  res.status(statusCode).json({
    success: 'error',
    message,
    statusCode,
    data
  });
};
