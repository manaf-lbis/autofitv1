import { Schema, model, Types, Document } from "mongoose";
import { IPretripSlot, SlotStatus } from "../types/pretrip";


export interface PretripSlotDocument extends IPretripSlot, Document<Types.ObjectId> { }

const pretripSlotSchema = new Schema<PretripSlotDocument>({

    status: {
        type: String,
        enum: Object.values(SlotStatus),
        required: true,
        default: SlotStatus.AVAILABLE,
    },
    mechanicId: {
        type: Schema.Types.ObjectId,
        ref: "mechanic",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: "vehicle",
    },
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "booking",
    },
    servicePlan: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },

}, { timestamps: true });



export const PretripSlotModel = model<PretripSlotDocument>("pretripSlot", pretripSlotSchema);

