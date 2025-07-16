import mongoose, { Schema, Document,Types } from 'mongoose';
import { Admin } from '../types/admin';
import { Role } from '../types/role';


export interface AdminDocument extends Admin,Document<Types.ObjectId> {}

const adminSchema: Schema <AdminDocument> = new Schema<AdminDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
    },
    mobile:{
        type:String
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default:'admin'
    },
    googleId:{
        type:String
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



export const AdminModel = mongoose.model<AdminDocument>('admin', adminSchema)

