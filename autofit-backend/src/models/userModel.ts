import mongoose, { Schema, Document,Types } from 'mongoose';
import { User } from '../types/user';


export interface UserDocument extends User,Document<Types.ObjectId> {}

const userSchema: Schema <UserDocument> = new Schema<UserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    mobile:{
        type:String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'mechanic']
    },
    googleId:{
        type:String
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default : 'active'
    },
    refreshToken :{
        type:String
    },
    failedLoginAttempts: {
        type: Number,
        default: 0 
    },
    lockUntil: {
        type: Date,
        default: null
    },
 
}, { timestamps: true })



export const UserModel = mongoose.model<UserDocument>('User', userSchema)

