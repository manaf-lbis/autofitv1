import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface CustomJwtPayload extends JwtPayload {
    id?:Types.ObjectId
    email?: string;
    name?: string;
    password?: string;
    mobile?: string;
    otpResent?:number
    role?: 'user' | 'admin' | 'mechanic';
}

declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload;
        }
    }
}
export {};