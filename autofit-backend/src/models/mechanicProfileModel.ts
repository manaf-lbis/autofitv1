import mongoose, { Schema, Document, Types } from 'mongoose';
import { MechanicAvailabilityStatus, MechanicProfile } from '../types/mechanic/mechanic';


export interface MechanicProfileDocument extends MechanicProfile, Document<Types.ObjectId> {}

const mechanicProfileSchema: Schema<MechanicProfileDocument> = new Schema<MechanicProfileDocument>({
    mechanicId: {
        type: mongoose.Schema.ObjectId,
        ref: 'mechanic'
    },
    availability :{
        type : String,
        enum: Object.values(MechanicAvailabilityStatus),
        default : MechanicAvailabilityStatus.NOT_AVAILABLE 
    },
    registration:{
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        rejectionReason: {
            type: String
        },
        approvedOn: {
            type: Date
        },
        rejectedOn: {
            type: Date
        }
    },
    education: {
        type: String,
        required: true,
    },
    specialised: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    shopName: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    landmark: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    shopImage: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    workingHours :{
        type:mongoose.Schema.ObjectId,
        ref:'workingHours'
    },
},{
    timestamps: true,
});

mechanicProfileSchema.index({ location: '2dsphere' });

export const MechanicProfileModel = mongoose.model<MechanicProfileDocument>('mechanicProfile', mechanicProfileSchema);