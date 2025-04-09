import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId,
    name: string,
    email: string,
    mobile:string,
    password: string,
    role: 'user' | 'admin' | 'mechanic',
    status: 'active' | 'blocked',
    createdAt?: Date,
    updatedAt?: Date
}
