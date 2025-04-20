
import mongoose, { Schema, Document,Types } from 'mongoose';
import { IVehicleBrand } from '../types/vehicle';


interface VehicleBrandDocument extends Omit<IVehicleBrand,"_id">,Document<Types.ObjectId> {}

const VehicleBrandSchema:Schema<VehicleBrandDocument> = new mongoose.Schema<VehicleBrandDocument>({
  brand: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  models: {
    type: [String],
    required: true,
  },
  isBlocked:{
    type:Boolean,
    default:false
  }
},
{
  timestamps: true 
});

export const vehicleBrandModel = mongoose.model<VehicleBrandDocument>('vehicleBrand', VehicleBrandSchema)