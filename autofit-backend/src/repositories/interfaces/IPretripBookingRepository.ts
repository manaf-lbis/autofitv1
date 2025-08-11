import { Types } from "mongoose";
import { PretripBookingDocument } from "../../models/pretripBooking";
import { IBaseRepository } from "./IBaseRepository";
import { PaymentStatus } from "../../types/pretrip";

export interface IPretripBookingRepository extends IBaseRepository<PretripBookingDocument> {
    checkoutDetails(serviceId: Types.ObjectId): Promise<any>
    detailedBooking(serviceId: Types.ObjectId): Promise<any>
    dayWiseBookings(mechanicId: Types.ObjectId,date:Date): Promise<any>
    updatePaymentStatus(serviceId: Types.ObjectId, status: PaymentStatus): Promise<any>
    weeklyScheduleOfMechanic(mechanicId: Types.ObjectId): Promise<any>
    todayScheduleOfMechanic(mechanicId: Types.ObjectId): Promise<any>

}