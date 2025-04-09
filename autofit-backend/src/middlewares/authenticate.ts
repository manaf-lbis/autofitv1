import {Request, Response, NextFunction} from 'express'
import { TokenService } from '../services/token/tokenService';


const tokenService = new TokenService()

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    
  
    if (!token) {
      res.status(401).json({ message: 'Access Denied. No Token Found' });
      return;
    }
  
    try {
      const decoded = tokenService.verifyToken(token);
      req.user = decoded; 
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or Expired Token" });
      return;
    }
};