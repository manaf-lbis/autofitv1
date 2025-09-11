// import { Types } from "mongoose";
// import { LiveAssistanceDocument } from "../../models/liveAssistanceModel";
// import { IBaseRepository } from "./IBaseRepository";
// import { Role } from "../../types/role";
// import { DashboardRange } from "../../services/admin/interface/IPageService";

// export interface PagenatedResponse {
//     totalDocuments: number;
//     history: LiveAssistanceDocument[]
// }
// export interface PagenatedHistoryParams {
//     start: number;
//     end: number;
//     userId: Types.ObjectId;
//     role: Role;
//     sortBy?: 'asc' | 'desc'
// }


// export interface ILiveAssistanceRepository extends IBaseRepository<LiveAssistanceDocument> {
//     checkoutDetails(serviceId: Types.ObjectId): Promise<LiveAssistanceDocument>
//     detailedBooking(serviceId: Types.ObjectId): Promise<any>
//     pagenatedLiveAssistanceHistory(params: PagenatedHistoryParams): Promise<PagenatedResponse>
//     getServiceDetails(serviceId: Types.ObjectId): Promise<any>
//     activeBookingsByMechanicId(mechanicId: Types.ObjectId): Promise<LiveAssistanceDocument | null>
//     findLatest(): Promise<LiveAssistanceDocument[]>
//     liveAssistanceDetailsByRange(range: DashboardRange): Promise<any>
    
// }   






import { Types } from "mongoose";
import { LiveAssistanceDocument } from "../../models/liveAssistanceModel";
import { IBaseRepository } from "./IBaseRepository";
import { Role } from "../../types/role";
import { GroupBy } from "../../services/admin/interface/IPageService";

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
    findLatest(start?: Date, end?: Date): Promise<LiveAssistanceDocument[]>
    liveAssistanceDetails(start: Date, end: Date, groupBy: GroupBy): Promise<any>
    
}   