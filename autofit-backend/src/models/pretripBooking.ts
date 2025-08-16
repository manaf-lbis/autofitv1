import { Document, model, Schema, Types } from "mongoose";
import { PretripStatus, IPretripBooking, PaymentStatus } from "../types/pretrip";



export interface PretripBookingDocument extends IPretripBooking , Document<Types.ObjectId> {}

const pretripBookingSchema = new Schema<PretripBookingDocument>({
    status:{
        type: String,
        enum: Object.values(PretripStatus),
        required: true,
        default: PretripStatus.BOOKED
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    mechanicId: {
        type: Schema.Types.ObjectId,
        ref: "mechanic",
        required: true
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: "vehicle",
        required: true
    },
    schedule: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    serviceReportId:{
        type: Schema.Types.ObjectId,
        ref: "pretripReport",
    },
    payment:{
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            required: true,
            default: PaymentStatus.INITIATED
        },
        paymentId: {
            type:Types.ObjectId,
            ref:'payment'
        }
    },
    cancellationReason:{
        type: String
    },
    pickedUpAt: {
        type: Date
    },
    returnedAt: {
        type: Date
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },


},{ timestamps: true });



pretripBookingSchema.index({ userId: 1, createdAt: -1 });
pretripBookingSchema.index({ pickupLocation: "2dsphere" });
pretripBookingSchema.index({ mechanicId: 1 });

export const PretripBookingModel = model<PretripBookingDocument>("pretripBooking", pretripBookingSchema);
