// import {Request, Response, NextFunction} from 'express'
// import { TokenService } from '../services/token/tokenService';
// import { CustomJwtPayload } from '../types/express';
// import { UserModel } from '../models/userModel';
// import { MechanicModel } from '../models/mechanicModel';


// const tokenService = new TokenService()

// export const authenticate = async (req: Request, res: Response, next: NextFunction): void => {

//     const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    
//     if (!token) {
//       res.status(401).json({ message: 'Access Denied. No Token Found' });
//       return;
//     }
  
//     try {
//       const decoded:CustomJwtPayload = tokenService.verifyToken(token)

//       let status 

//       if(decoded.role === 'user'){
//         status = await UserModel.findById(decoded.id).select('status')
//       }else if(decoded.role === 'mechanic'){
//         status = await MechanicModel.findById(decoded.id).select('status')
//       }

//       if(status === 'blocked'){
//         res.status(401).json({ message: 'User Bloked' });
//       }

//       req.user = decoded;
//       next();


//     } catch (err) {
//       res.status(401).json({ message: "Invalid or Expired Token" });
//       return;
//     }
// };


import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token/tokenService';
import { CustomJwtPayload } from '../types/express';
import { UserModel } from '../models/userModel';
import { MechanicModel } from '../models/mechanicModel';

const tokenService = new TokenService();

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: 'Access Denied. No Token Found' });
    return;
  }

  try {
    const decoded: CustomJwtPayload = tokenService.verifyToken(token);
    req.user = decoded; 

    if (decoded.password || decoded.role === 'admin') {
      return next();
    }

    
    let userDoc;
    if (decoded.role === 'user') {
      userDoc = await UserModel.findById(decoded.id).select('status');
    } else if (decoded.role === 'mechanic') {
      userDoc = await MechanicModel.findById(decoded.id).select('status');
    }

    if (!userDoc) {
      res.status(401).json({ message: 'User Not Found' });
      return;
    }

    if (userDoc.status === 'blocked') {
      res.status(401).json({ message: 'Access Denied. User is Blocked' });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};