import { Types } from "mongoose";

export interface ILiveAssistanceService {
    createBooking(concern: string, description: string, userId:Types.ObjectId): Promise<any>
    getDetails(serviceId: Types.ObjectId,userId:Types.ObjectId): Promise<any>
    getSessionDetails(serviceId: Types.ObjectId,userId:Types.ObjectId): Promise<any>
    activeBookingsByMechanicId(mechanicId:Types.ObjectId): Promise<any>
}