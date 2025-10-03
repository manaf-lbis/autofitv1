import mongoose, { Types, Document, Schema } from "mongoose";
import { RoadsideAssistance, RoadsideAssistanceStatus, ServiceType } from "../types/services";
import { generateBookingId } from "../utils/bookingIdGenerator";


export interface RoadsideAssistanceDocument extends RoadsideAssistance, Document<Types.ObjectId> { }

const roadsideAssistanceSchema: Schema<RoadsideAssistanceDocument> = new Schema<RoadsideAssistanceDocument>({

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    bookingId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateBookingId(ServiceType.ROADSIDE),
    },
    issue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    vehicle: {
        regNo: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        modelName: {
            type: String,
            required: true
        },
        owner: {
            type: String,
            required: true
        }
    },
    serviceLocation: {
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
    mechanicId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'mechanic'
    },
    status: {
        type: String,
        enum: Object.values(RoadsideAssistanceStatus),
        default: RoadsideAssistanceStatus.ASSIGNED,
        required: true
    },
    quotationId: {
        type: Schema.Types.ObjectId,
        ref: 'quotation',
        default: null
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'payment',
        default: null
    },
    startedAt: {
        type: Date,
        default: null
    },
    arrivedAt: {
        type: Date,
        default: null
    },
    endedAt: {
        type: Date,
        default: null
    },
    ratingId: {
        type: Schema.Types.ObjectId,
        ref: 'rating',
        default: null
    }
}, { timestamps: true });


roadsideAssistanceSchema.index({ serviceLocation: '2dsphere' });
roadsideAssistanceSchema.index({ userId: 1 });
roadsideAssistanceSchema.index({ mechanicId: 1 });


export const RoadsideAssistanceModel = mongoose.model<RoadsideAssistanceDocument>('roadsideAssistance', roadsideAssistanceSchema);


