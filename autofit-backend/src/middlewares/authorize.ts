import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../types/responseCode";

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.status = status;
  }
}

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError("Not authenticated", HttpStatus.UNAUTHORIZED);
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      throw new ApiError("Forbidden: Insufficient permissions", HttpStatus.FORBIDDEN);
    }
    
    next();
  };
};