import { Types } from "mongoose";
import { LiveAssistanceDocument } from "../../models/liveAssistanceModel";
import { Role } from "../../types/role";

interface PagenationInfo{
  totalDocuments: number,
  hasMore: boolean
}

export interface LiveAssistanceHistoryResponse extends PagenationInfo{
  history: LiveAssistanceDocument[]
}



export interface ILiveAssistanceService {
    createBooking(concern: string, description: string, userId:Types.ObjectId): Promise<any>
    getDetails(serviceId: Types.ObjectId,userId:Types.ObjectId): Promise<any>
    getSessionDetails(serviceId: Types.ObjectId,userId:Types.ObjectId): Promise<any>
    activeBookingsByMechanicId(mechanicId:Types.ObjectId): Promise<any>
    serviceHistory(mechanicId:Types.ObjectId,page:number): Promise<LiveAssistanceHistoryResponse>
    getInvoice(serviceId: Types.ObjectId,userId:Types.ObjectId): Promise<any>
    markAsCompleted(serviceId: Types.ObjectId,userId:Types.ObjectId,role:Role): Promise<any>
}