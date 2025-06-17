import { Types } from "mongoose";

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
    status: 'assigned'|'on_the_way'|'analysing'|'quotation_sent'| 'in_progress'| 'completed'| 'canceled';
    quotationId?: Types.ObjectId;
    paymentId?: Types.ObjectId;
    startedAt?: Date;
    arrivedAt?:Date;
    endedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Quotation {
    _id: Types.ObjectId;
    serviceId: Types.ObjectId;
    items: Array<{
        name: string;
        qty: number;
        price: number;
    }>;
    total: number;
    notes:string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
    rejectedAt?: Date;
}

//data transfred object from client
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