import { Types } from "mongoose";
import { PretripBookingDocument } from "../../models/pretripBooking";
import { IBaseRepository } from "./IBaseRepository";
import { PaymentStatus } from "../../types/pretrip";
import { Role } from "../../types/role";
import { DashboardRange } from "../../services/admin/interface/IPageService";

export interface PagenatedResponse {
    totalDocuments: number;
    history: PretripBookingDocument[]
}
export interface PagenatedHistoryParams {
    start: number;
    end: number;
    userId: Types.ObjectId;
    role: Role;
    sortBy?: 'asc' | 'desc'
}


export interface IPretripBookingRepository extends IBaseRepository<PretripBookingDocument> {
    checkoutDetails(serviceId: Types.ObjectId): Promise<any>
    detailedBooking(serviceId: Types.ObjectId): Promise<any>
    dayWiseBookings(mechanicId: Types.ObjectId,date:Date): Promise<any>
    updatePaymentStatus(serviceId: Types.ObjectId, status: PaymentStatus): Promise<any>
    weeklyScheduleOfMechanic(mechanicId: Types.ObjectId): Promise<any>
    todayScheduleOfMechanic(mechanicId: Types.ObjectId): Promise<any>
    activeWorks(mechanicId: Types.ObjectId): Promise<any>
    completedWorks(mechanicId: Types.ObjectId): Promise<PretripBookingDocument[]>
    pagenatedPretripHistory(params: PagenatedHistoryParams): Promise<PagenatedResponse>
    pretripBookingDetailsByRange(range: DashboardRange): Promise<any>
}