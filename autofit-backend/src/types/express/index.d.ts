import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export interface CustomJwtPayload extends JwtPayload {
    id?:ObjectId
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