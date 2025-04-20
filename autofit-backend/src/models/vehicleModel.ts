import mongoose, { Document, Schema, Types } from "mongoose";
import { Vehicle } from "../types/vehicle";

export interface VehicleDocument extends Omit<Vehicle, '_id'>, Document<Types.ObjectId> {}

const vehicleSchema: Schema<VehicleDocument> = new Schema<VehicleDocument>({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',                 
        required: true
    },
    regNo:{
        type:String,
        required:true,
        set: (value: string) => value.toUpperCase() 
    },
    brand:{
        type:String,
    },
    modelName:{
        type:String
    },
    fuelType:{
        type:String,
        enum:['Petrol' , 'Diesel' , 'cng' , 'ev']
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    owner:{
        type:String
    }
},{timestamps:true})

export const VehicleModel = mongoose.model<VehicleDocument>('Vehicle',vehicleSchema)