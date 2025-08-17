import { Types } from "mongoose";
import { LiveAssistanceDocument } from "../../models/liveAssistanceModel";
import { IBaseRepository } from "./IBaseRepository";
import { Role } from "../../types/role";

export interface PagenatedResponse {
    totalDocuments: number;
    history: LiveAssistanceDocument[]
}
export interface PagenatedHistoryParams {
    start: number;
    end: number;
    userId: Types.ObjectId;
    role: Role;
    sortBy?: 'asc' | 'desc'
}


export interface ILiveAssistanceRepository extends IBaseRepository<LiveAssistanceDocument> {
    checkoutDetails(serviceId: Types.ObjectId): Promise<LiveAssistanceDocument>
    detailedBooking(serviceId: Types.ObjectId): Promise<any>
    pagenatedLiveAssistanceHistory(params: PagenatedHistoryParams): Promise<PagenatedResponse>
    getServiceDetails(serviceId: Types.ObjectId): Promise<any>
    activeBookingsByMechanicId(mechanicId: Types.ObjectId): Promise<LiveAssistanceDocument | null>
    
}   