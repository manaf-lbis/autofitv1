import { ObjectId } from "mongodb";

export interface Mechanic {
    _id: ObjectId,
    name: string,
    email: string,
    mobile:string,
    password: string,
    role: 'user' | 'admin' | 'mechanic',
    status: 'active' | 'blocked',
    refreshToken:string
    failedLoginAttempts:number
    lockUntil:Date | null
    googleId?:string,
    createdAt?: Date,
    updatedAt?: Date
}
