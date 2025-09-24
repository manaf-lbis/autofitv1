import { Types } from "mongoose";


export enum RoadsideAssistanceStatus {
  ASSIGNED = 'assigned',
  ON_THE_WAY = 'on_the_way',
  ANALYSING = 'analysing',
  QUOTATION_SENT = 'quotation_sent',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

export enum RoadsideQuotationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}


export interface RoadsideAssistance {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    issue: string;
    description: string;
    vehicle: {
        regNo: string;
        brand: string;
        modelName: string;
        owner: string;
    };
    serviceLocation: {
        type: 'Point';
        coordinates: [number, number];
    };
    mechanicId: Types.ObjectId;
    status: RoadsideAssistanceStatus;
    quotationId?: Types.ObjectId;
    paymentId?: Types.ObjectId;
    startedAt: Date;
    arrivedAt?:Date;
    endedAt: Date;
    ratingId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface Quotation {
    _id: Types.ObjectId;
    serviceId: Types.ObjectId;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    notes:string;
    status: RoadsideQuotationStatus;
    createdAt: Date;
    updatedAt: Date;
    rejectedAt?: Date;
}


export type CreateRoadsideAssistanceDTO = {
  mechanicId: Types.ObjectId;
  vehicle: {
    regNo: string;
    brand: string;
    modelName: string;
    owner: string;
  };
  userId: Types.ObjectId;
  issue: string;
  description: string;
  serviceLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
};


export enum ServiceType {
  ROADSIDE = 'roadside',
  PRETRIP = 'pretrip',
  LIVE = 'liveAssistance',
}