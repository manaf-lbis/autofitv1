export interface Otp {
    email : string
    otp : string, 
    verified: boolean;  
    attempt: number,
    createdAt : Date,
    expiresAt: Date;           
}