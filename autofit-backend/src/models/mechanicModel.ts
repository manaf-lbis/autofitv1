import mongoose, { Schema, Document,Types } from 'mongoose';
import { Mechanic } from '../types/mechanic/mechanic';
import { Role } from '../types/role';


export interface MechanicDocument extends Mechanic,Document<Types.ObjectId> {}

const mechanicSchema: Schema <MechanicDocument> = new Schema<MechanicDocument>({
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
    mobile :{
        type: String,
    },
    avatar:{
        type:String
    },
    role: {
        type: String,
        enum: Object.values(Role),
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

export const MechanicModel = mongoose.model<MechanicDocument>('mechanic', mechanicSchema)

