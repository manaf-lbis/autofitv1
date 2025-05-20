import mongoose, { Schema, Document,Types } from 'mongoose';
import { Admin } from '../types/admin';


interface adminDocument extends Admin,Document<Types.ObjectId> {}

const adminSchema: Schema <adminDocument> = new Schema<adminDocument>({
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



export const AdminModel = mongoose.model<adminDocument>('Admin', adminSchema)

