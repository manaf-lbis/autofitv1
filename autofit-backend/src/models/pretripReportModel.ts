import { Document, model, Schema, Types } from "mongoose";
import { IPretripReport, CheckupCondition } from "../types/pretrip";


export interface PretripReportDocument extends IPretripReport , Document<Types.ObjectId> {}

const pretripReport = new Schema<PretripReportDocument>({
    servicePlan: {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    },
    reportItems:[{
        feature:{
            type: String,
            required: true,
        },
        condition:{
            type: String,
            enum: Object.values(CheckupCondition)
        },
        remarks: {
            type: String,
        },
        needsAction: {
            type: Boolean,
        }
    }],
    mechanicNotes: {
        type: String,
    }

},{ timestamps: true });


export const PretripReportModel = model<PretripReportDocument>("pretripReport", pretripReport);
