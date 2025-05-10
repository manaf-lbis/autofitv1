export class ApiError extends Error {
    statusCode: number;
    data : any | null;
  
    constructor(message: string, statusCode = 500, data?:any) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      this.data = data
      Error.captureStackTrace(this, this.constructor);
    }
}