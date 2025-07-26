import { Types } from "mongoose";
import { PretripBookingDocument, PretripBookingModel } from "../models/pretripBooking";
import { BaseRepository } from "./baseRepository";
import { IPretripBookingRepository } from "./interfaces/IPretripBookingRepository";

export class PretripBookingRepository extends BaseRepository<PretripBookingDocument> implements IPretripBookingRepository {
    constructor(){
        super(PretripBookingModel)
    }

    async checkoutDetails(serviceId: Types.ObjectId): Promise<any> {
        return await PretripBookingModel.findOne({_id:serviceId}).populate('vehicleId','regNo')
    }

    async detailedBooking(serviceId: Types.ObjectId): Promise<any> {
        return await PretripBookingModel.findOne({_id:serviceId}).populate('vehicleId').populate('userId','name email mobile').populate('payment.paymentId')
    }

}