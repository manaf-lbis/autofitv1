import { Role } from "./role";
export interface Otp {
    email : string
    otp : string, 
    verified: boolean;  
    role:Role;
    attempt: number,
    createdAt : Date,
    expiresAt: Date;           
}