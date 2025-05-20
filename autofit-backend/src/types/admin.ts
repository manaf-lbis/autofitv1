import { ObjectId } from "mongodb";

export interface Admin {
    _id: ObjectId,
    name: string,
    email: string,
    mobile: string,
    password: string,
    role: 'admin',
    refreshToken:string
    failedLoginAttempts:number
    lockUntil:Date | null
    googleId?:string,
    createdAt?: Date,
    updatedAt?: Date
}