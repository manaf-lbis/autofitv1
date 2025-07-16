import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId,
    name: string,
    email: string,
    mobile:string,
    password: string,
    role: 'user' ,
    status: 'active' | 'blocked',
    refreshToken:string
    failedLoginAttempts:number
    lockUntil:Date | null
    googleId?:string,
    createdAt?: Date,
    updatedAt?: Date
}
