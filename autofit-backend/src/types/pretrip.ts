import { Types } from "mongoose";

export interface IPretripPlan  {
    _id:Types.ObjectId
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration:number;
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

export enum PretripStatus {
  BOOKED = 'booked',
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
  bookingId: string;
  vehicleId: Types.ObjectId;
  schedule:{
    start: Date;
    end: Date;
  },
  timeBlockingId: Types.ObjectId;
  serviceReportId: Types.ObjectId;
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
  },
  ratingId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export enum CheckupCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor',
}

export interface IReportItem {
  _id: Types.ObjectId;
  feature: string;
  condition?: CheckupCondition
  remarks?: string;
  needsAction?: boolean;
}

export interface IPretripReport {
  servicePlan: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
  };
  reportItems: IReportItem[];
  mechanicNotes:string;
  createdAt: Date;
  updatedAt: Date;
}