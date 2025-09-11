import { NextFunction, Request, Response} from 'express';
import { ApiError } from '../utils/apiError';
import { HttpStatus } from '../types/responseCode';
import logger from '../utils/logger';

export const errorHandler = (err: ApiError, req: Request, res: Response, _next:NextFunction ) => {

  logger.error(err.message);
  console.log(err);
  
  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';
  const data = err.data || null

  res.status(statusCode).json({
    success: 'error',
    message,
    statusCode,
    data
  });
};
