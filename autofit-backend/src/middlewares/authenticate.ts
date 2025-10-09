import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token/tokenService';
import { CustomJwtPayload } from '../types/express';
import { UserModel } from '../models/userModel';
import { MechanicModel } from '../models/mechanicModel';
import { ApiError } from '../utils/apiError';
import { HttpStatus } from '../types/responseCode';
import { Role } from '../types/role';

const tokenService = new TokenService();

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  try {
    if (!token) throw new ApiError('Access Denied. No Token Found',HttpStatus.UNAUTHORIZED);
    const decoded: CustomJwtPayload = tokenService.verifyToken(token);
    req.user = decoded; 


    if (decoded.password || decoded.role === Role.ADMIN) {
      return next();
    }
    
    let userDoc;
    if (decoded.role === Role.USER) {
      userDoc = await UserModel.findById(decoded.id).select('status');
    } else if (decoded.role === Role.MECHANIC) {
      userDoc = await MechanicModel.findById(decoded.id).select('status');
    }

    if (!userDoc) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'User Not Found' });
      return;
    }

    if ( userDoc.status === 'blocked' && req.path !== '/logout') {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Access Denied. User is Blocked' });
      return;
    }

    next();
  } catch {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid or Expired Token" });
  }
};