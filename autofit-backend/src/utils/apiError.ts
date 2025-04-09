export class ApiError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
}