import { Document, model, Schema, Types } from "mongoose";
import { ITimeBlock } from "../types/mechanic/mechanic";


export enum BlockType {
    MECHANIC_BLOCK = "mechanic_block",
    USER_BOOKING = "user_booking",
    PAYMENT_DELAY = "payment_delay"
}


export interface TimeBlockDocument extends ITimeBlock, Document<Types.ObjectId> { }

const timeBlockSchema = new Schema<TimeBlockDocument>({
    
    mechanicId: {
        type: Schema.Types.ObjectId,
        ref: 'mechanic',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startMinutes: {
        type: Number,
        required: true,
        min: 0,
        max: 1439,
    },
    endMinutes: {
        type: Number,
        required: true,
        min: 0,
        max: 1439,
    },
    blockType: {
        type: String,
        enum: Object.values(BlockType),
        required: true
    },
    reason: {
        type: String,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true });



export const TimeBlockModel = model<TimeBlockDocument>("timeBlock", timeBlockSchema);

