import { Request, Response ,NextFunction} from 'express';
import { ApiError } from '../utils/apiError';
import { HttpStatus } from '../types/responseCode';

export const errorHandler = (err: ApiError, req: Request, res: Response, next:NextFunction ) => {

  console.log(err.message,err.stack);
  
  
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
