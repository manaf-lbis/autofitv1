import mongoose, { Schema, Document, Types } from 'mongoose';
import {IPretripFeature,IPretripPlan } from '../types/pretrip';


export interface PretripPlanDocument extends IPretripPlan, Document<Types.ObjectId> {}

const planSchema : Schema<PretripPlanDocument> = new Schema<PretripPlanDocument>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    features: [{
        type: Schema.Types.ObjectId,
        ref: 'feature',
        required: true
    }],
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    duration:{
        type:Number,
        required:true
    },
    isPopular: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });


export interface PretripFeatureDocument extends IPretripFeature, Document<Types.ObjectId> {}

const featureSchema :Schema<PretripFeatureDocument> = new Schema<PretripFeatureDocument>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

}, { timestamps: true });



export const PretripPlanModel = mongoose.model<PretripPlanDocument>('plan', planSchema);
export const PretripFeatureModel = mongoose.model<PretripFeatureDocument>('feature', featureSchema);

