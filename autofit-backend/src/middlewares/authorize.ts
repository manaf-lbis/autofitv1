import { Request, Response, NextFunction } from "express";

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.status = status;
  }
}

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError("Not authenticated", 401);
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      throw new ApiError("Forbidden: Insufficient permissions", 403);
    }
    
    next();
  };
};