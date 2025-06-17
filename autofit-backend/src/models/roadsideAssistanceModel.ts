import mongoose, { Types, Document, Schema } from "mongoose";
import { RoadsideAssistance } from "../types/services";


export interface RoadsideAssistanceDocument extends RoadsideAssistance, Document<Types.ObjectId> { }

const roadsideAssistanceSchema: Schema<RoadsideAssistanceDocument> = new Schema<RoadsideAssistanceDocument>({

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
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
        enum: ['assigned','on_the_way','analysing','quotation_sent', 'in_progress',  'completed', 'canceled'],
        default: 'assigned',
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
    endedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });


roadsideAssistanceSchema.index({ serviceLocation: '2dsphere' });
roadsideAssistanceSchema.index({ userId: 1 });
roadsideAssistanceSchema.index({ mechanicId: 1 });


export const RoadsideAssistanceModel = mongoose.model<RoadsideAssistance>('roadsideAssistance', roadsideAssistanceSchema);


