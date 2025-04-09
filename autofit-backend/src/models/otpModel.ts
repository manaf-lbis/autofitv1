import mongoose,{Schema,Document,Types} from "mongoose";
import { Otp } from "../types/otp";

export interface OtpDocument extends Otp , Document<Types.ObjectId>{}

const otpSchema : Schema<OtpDocument> =  new Schema<OtpDocument>  ({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    attempt:{
        type : Number,
        default : 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    
},{timestamps:true});


otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = mongoose.model<OtpDocument>('Otp', otpSchema);
