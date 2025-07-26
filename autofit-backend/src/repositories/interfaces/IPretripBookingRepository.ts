import { Types } from "mongoose";
import { PretripBookingDocument } from "../../models/pretripBooking";
import { IBaseRepository } from "./IBaseRepository";

export interface IPretripBookingRepository extends IBaseRepository<PretripBookingDocument> {
    checkoutDetails(serviceId: Types.ObjectId): Promise<any>
    detailedBooking(serviceId: Types.ObjectId): Promise<any>

}