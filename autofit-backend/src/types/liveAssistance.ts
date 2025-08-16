import { Types } from "mongoose";

export enum LiveAssistanceStatus {
    PENDING = 'pending',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}


export interface ILiveAssistance {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    mechanicId: Types.ObjectId;
    status: LiveAssistanceStatus;
    paymentId: Types.ObjectId;
    startTime : Date;
    endTime : Date;
    blockedTimeId : Types.ObjectId;
    issue: string;
    description: string;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}