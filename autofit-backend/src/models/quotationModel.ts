import mongoose, { Schema, Types, Document } from "mongoose";
import { Quotation, RoadsideQuotationStatus } from "../types/services";


export interface QuotationDocument extends Quotation, Document<Types.ObjectId> {}

const quotationSchema: Schema<QuotationDocument> = new Schema({

    serviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'RoadsideAssistance'
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(RoadsideQuotationStatus),
        default: RoadsideQuotationStatus.PENDING,
        required: true
    },
    rejectedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });


quotationSchema.index({ requestId: 1 });

export const QuotationModel = mongoose.model<QuotationDocument>('quotation', quotationSchema);


