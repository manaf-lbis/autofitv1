import { Types } from "mongoose";
import { PretripBookingDocument, PretripBookingModel } from "../models/pretripBooking";
import { BaseRepository } from "./baseRepository";
import { IPretripBookingRepository } from "./interfaces/IPretripBookingRepository";
import { PaymentStatus, PretripStatus } from "../types/pretrip";
import { addDays, endOfDay, startOfDay } from "date-fns";

export class PretripBookingRepository extends BaseRepository<PretripBookingDocument> implements IPretripBookingRepository {
    constructor() {
        super(PretripBookingModel)
    }

    async checkoutDetails(serviceId: Types.ObjectId): Promise<any> {
        return await PretripBookingModel.findOne({ _id: serviceId }).populate('vehicleId', 'regNo').populate('serviceReportId','servicePlan.price -_id')
    }

    async detailedBooking(serviceId: Types.ObjectId): Promise<any> {
        return await PretripBookingModel.findOne({ _id: serviceId })
        .populate('vehicleId')
        .populate('userId', 'name email mobile')
        .populate('payment.paymentId')
        .populate('serviceReportId','servicePlan.price -_id')
    }

    async dayWiseBookings(mechanicId: Types.ObjectId, date: Date): Promise<any> {
        return await PretripBookingModel.find({ mechanicId, 'schedule.start': { $gte: date } }).select('schedule -_id')
    }

    async updatePaymentStatus(serviceId: Types.ObjectId, status: PaymentStatus,): Promise<any> {
        return await PretripBookingModel.updateOne({ _id: serviceId }, { $set: { 'payment.status': status } })
    }

    async weeklyScheduleOfMechanic(mechanicId: Types.ObjectId): Promise<any> {
        const start = startOfDay(new Date());
        const end = addDays(start, 6);
        return await PretripBookingModel.find({
            mechanicId,
            'schedule.start': { $gte: start, $lte: end }
            , 'payment.status': PaymentStatus.PAID
        })
            .populate('userId', 'name email mobile')
            .populate('vehicleId', 'regNo brand modelName')
            .select('userId vehicleId schedule servicePlan.name status')
    }

    async todayScheduleOfMechanic(mechanicId: Types.ObjectId): Promise<any> {
        const start = startOfDay(new Date());
        const end = endOfDay(start)
        return await PretripBookingModel.find({
            mechanicId,
            'schedule.start': { $gte: start, $lte: end },
            'payment.status': PaymentStatus.PAID,
            status: PretripStatus.BOOKED
        }).populate('userId', 'name mobile')
        .populate('vehicleId', 'regNo brand modelName').populate('serviceReportId','servicePlan.name -_id')
        .select('userId pickupLocation.coordinates vehicleId schedule servicePlan.name status serviceReportId')
    }






}