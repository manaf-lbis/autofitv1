import { Types } from "mongoose";

export interface IPretripPlan  {
    _id:Types.ObjectId
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    features: string[];
    isDeleted: boolean;
    isActive: boolean;
    isPopular: boolean;
    createdAt: Date; 
    updatedAt: Date; 
}

export interface IPretripFeature {
    _id:Types.ObjectId
    name: string;
    createdAt: Date; 
    updatedAt: Date; 
}

export enum SlotStatus {
  BOOKED = 'booked',
  AVAILABLE = 'available',
  CANCELLED = 'cancelled',
}

export interface IPretripSlot {
  _id: Types.ObjectId;
  date: Date;
  status: SlotStatus;
  mechanicId: Types.ObjectId;
  userId?: Types.ObjectId;
  vehicleId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  servicePlan?: string;
  createdAt: Date;
  updatedAt: Date;
}