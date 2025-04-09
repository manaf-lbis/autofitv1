import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export interface CustomJwtPayload extends JwtPayload {
    _id?:ObjectId
    email?: string;
    name?: string;
    password?: string;
    mobile?: string;
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