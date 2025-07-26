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
  BLOCKED = 'blocked',
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

export enum PretripStatus{
  BOOKED = 'booked',
  PICKED_UP = 'picked_up',
  ANALYSING='analysing',
  REPORT_CREATED = 'report_created',
  VEHICLE_RETURNED = 'vehicle_returned',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  INITIATED = 'initiated',
  PAID = 'paid',
  PENDING = 'pending',
  FAILED = 'failed',
}

export interface IPretripBooking {
  _id: Types.ObjectId;
  status: PretripStatus;
  mechanicId: Types.ObjectId;
  userId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  slotId: Types.ObjectId;
  reportId?: Types.ObjectId;
  servicePlan: {
    name: string;
    description: string;
    originalPrice: number;
    price: number;
    features: string[];
  };
  pickedUpAt?: Date;
  returnedAt?: Date;
  pickupLocation?:{
    type:"Point",
    coordinates:[number,number]
  },
  cancellationReason?: string;
  payment?: {
    status: PaymentStatus;
    paymentId?: Types.ObjectId;
  }
  createdAt: Date;
  updatedAt: Date;
}