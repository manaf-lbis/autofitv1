import { Types } from "mongoose";
import { LiveAssistanceDocument } from "../../models/liveAssistanceModel";

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
}