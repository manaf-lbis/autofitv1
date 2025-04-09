import mongoose, { Schema, Document,Types } from 'mongoose';
import { User } from '../types/user';

interface userDocument extends User,Document<Types.ObjectId> {}

const userSchema: Schema <userDocument> = new Schema<userDocument>({
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
    role: {
        type: String,
        enum: ['user', 'admin', 'mechanic']
    },
    status: {
        type: String,
        enum: ['active', 'blocked']
    }
}, { timestamps: true })



export const UserModel = mongoose.model<userDocument>('User', userSchema)

