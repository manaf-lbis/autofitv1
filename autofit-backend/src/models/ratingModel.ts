import { Schema, model, Types, Document } from "mongoose";
import { Rating } from "../types/rating";
import { ServiceType } from "../types/services";

export interface RatingDocument extends Rating, Document<Types.ObjectId> { }

const ratingSchema = new Schema<RatingDocument>({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true
    },
    mechanicId: {
        type: Schema.Types.ObjectId,
        ref: 'mechanic',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    serviceType: {
        type: String,
        enum: Object.values(ServiceType),
        required: true
    },

}, { timestamps: true });


export const RatingModel = model<RatingDocument>("rating", ratingSchema);

