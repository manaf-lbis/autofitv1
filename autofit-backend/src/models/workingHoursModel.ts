import { Schema, model, Types, Document } from "mongoose";
import { IMechanicTiming, IDayTiming } from "../types/mechanic/mechanic";


const DayTimingSchema = new Schema<IDayTiming>(
    {
        isOpen: { type: Boolean, default: false },
        openTime: { type: Number  },
        closeTime: { type: Number  }
    },
    { _id: false }
);

export interface WorkingHoursDocument extends IMechanicTiming, Document<Types.ObjectId> { }

const workingHoursSchema = new Schema<WorkingHoursDocument>({

    mechanicId: {
        type: Schema.Types.ObjectId,
        ref: 'mechanic',
        required: true
    },
    sunday: {
        type: DayTimingSchema,
        required: true
    },
    monday: {
        type: DayTimingSchema,
        required: true
    },
    tuesday: {
        type: DayTimingSchema,
        required: true
    },
    wednesday: {
        type: DayTimingSchema,
        required: true
    },
    thursday: {
        type: DayTimingSchema,
        required: true
    },
    friday: {
        type: DayTimingSchema,
        required: true
    },
    saturday: {
        type: DayTimingSchema,
        required: true
    }

}, { timestamps: true });



export const WorkingHoursModel = model<WorkingHoursDocument>("workingHours", workingHoursSchema);

