import { Document, model, Schema, Types } from "mongoose";
import { TransactionStatus, Transaction } from "../types/transaction";
import { ServiceType } from "../types/services";


export interface TransactionDocument extends Transaction, Document<Types.ObjectId> {}

const transactionSchema = new Schema<TransactionDocument>({

    mechanicId: {
        type: Schema.Types.ObjectId,
        ref: 'mechanic',
        required: true
    },
    userId :{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    paymentId :{
        type: Schema.Types.ObjectId,
        ref: 'payment',
        required: true
    },
    serviceType :{
        type: String,
        enum: Object.values(ServiceType),
        required: true
    },
    serviceId :{
        type: Schema.Types.ObjectId,
        ref: 'pretrip',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.RECEIVED
    },
    grossAmount: {
        type: Number,
        required: true
    },
    deductionRate: {
        type: Number,
        required: true
    },
    deductionAmount: {
        type: Number,
        required: true
    },
    netAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    transactionId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }

}, { timestamps: true });



export const TransactionModel = model<TransactionDocument>("transaction", transactionSchema);

