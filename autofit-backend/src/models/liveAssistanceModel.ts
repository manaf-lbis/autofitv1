import mongoose, { Schema, Document, Types } from 'mongoose';
import { ILiveAssistance, LiveAssistanceStatus } from '../types/liveAssistance';
import { randomUUID } from "crypto";
import { generateBookingId } from '../utils/bookingIdGenerator';
import { ServiceType } from '../types/services';

export interface LiveAssistanceDocument extends ILiveAssistance, Document<Types.ObjectId> { }

const liveAssistanceSchema: Schema<LiveAssistanceDocument> = new Schema<LiveAssistanceDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    bookingId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateBookingId(ServiceType.LIVE),
    },
    mechanicId: {
        type: Schema.Types.ObjectId,
        ref: 'mechanic',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(LiveAssistanceStatus),
        default: LiveAssistanceStatus.PENDING,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default :  () => Number(process.env.LIVE_ASSISTANCE_PRICE)
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'payment',
    },
    sessionId: {
        type: String,
        required: true,
        default : () => randomUUID()
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true,
        default: function () {
            const duration = Number(process.env.LIVE_ASSISTANCE_DURATION || 0);
            const buffer = Number(process.env.PAYMENT_BUFFER || 0);
            return new Date(Date.now() + (duration + buffer)  * 60 * 1000);
        },
    },
    blockedTimeId: {
        type: Schema.Types.ObjectId,
        ref: 'timeBlock',
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    ratingId :{
        type: Schema.Types.ObjectId,
        ref: 'rating',
        default : null
    }
}, { timestamps: true })

export const LiveAssistanceModel = mongoose.model<LiveAssistanceDocument>('liveAssistance', liveAssistanceSchema)

