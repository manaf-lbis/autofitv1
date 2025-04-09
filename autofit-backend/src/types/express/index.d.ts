import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
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