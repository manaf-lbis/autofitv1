import { Types } from "mongoose";

export enum LiveAssistanceStatus {
    PENDING = 'pending',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    TIMEOUT = 'timeout'
}


export interface ILiveAssistance {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    mechanicId: Types.ObjectId;
    status: LiveAssistanceStatus;
    price: number;
    paymentId: Types.ObjectId;
    startTime : Date;
    endTime : Date;
    sessionId : string;
    blockedTimeId : Types.ObjectId;
    issue: string;
    description: string;
    duration: number;
    ratingId : Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}