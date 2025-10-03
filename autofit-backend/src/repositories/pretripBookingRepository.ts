import { Types } from "mongoose";
import { PretripBookingDocument, PretripBookingModel } from "../models/pretripBooking";
import { BaseRepository } from "./baseRepository";
import { IPretripBookingRepository, PagenatedHistoryParams, PagenatedResponse } from "./interfaces/IPretripBookingRepository";
import { PaymentStatus, PretripStatus } from "../types/pretrip";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { Role } from "../types/role";
import { GroupBy } from "../services/admin/interface/IPageService";

export class PretripBookingRepository extends BaseRepository<PretripBookingDocument> implements IPretripBookingRepository {
    constructor() {
        super(PretripBookingModel)
    }

    async checkoutDetails(serviceId: Types.ObjectId): Promise<any> {
        return await PretripBookingModel.findOne({ _id: serviceId }).populate('vehicleId', 'regNo').populate('serviceReportId', 'servicePlan.price -_id')
    }

    async detailedBooking(serviceId: Types.ObjectId): Promise<any> {
        return await PretripBookingModel.findOne({ _id: serviceId })
            .populate('vehicleId')
            .populate('userId', 'name email mobile')
            .populate('payment.paymentId')
            .populate('serviceReportId')
            .populate('ratingId', '_id review rating')
    }

    async dayWiseBookings(mechanicId: Types.ObjectId, date: Date): Promise<any> {
        return await PretripBookingModel.find({ mechanicId, 'schedule.start': { $gte: date } }).select('schedule -_id')
    }

    async updatePaymentStatus(serviceId: Types.ObjectId, status: PaymentStatus): Promise<any> {
        return await PretripBookingModel.findOneAndUpdate(
            { _id: serviceId },
            { $set: { 'payment.status': status } },
            { new: true } 
        );
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
            .select('userId vehicleId schedule servicePlan.name status bookingId')
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
            .populate('vehicleId', 'regNo brand modelName').populate('serviceReportId', 'servicePlan.name -_id')
            .select('userId pickupLocation.coordinates vehicleId schedule servicePlan.name status serviceReportId')
    }

    async activeWorks(mechanicId: Types.ObjectId): Promise<any> {
        return await PretripBookingModel.find({ mechanicId, status: { $in: [PretripStatus.ANALYSING, PretripStatus.REPORT_CREATED] } })
            .populate('userId', 'name')
            .populate('vehicleId', 'regNo brand modelName')
            .select('userId vehicleId schedule status')
    }

    async completedWorks(mechanicId: Types.ObjectId): Promise<PretripBookingDocument[]> {
        return await PretripBookingModel.find({ mechanicId, status: PretripStatus.COMPLETED })
            .populate('userId', 'name')
            .populate('vehicleId', 'regNo brand modelName')
            .select('userId vehicleId schedule status pickupLocation.coordinates')
    }

    async pagenatedPretripHistory({ end, start, userId, role, sortBy }: PagenatedHistoryParams): Promise<PagenatedResponse> {

        const query = role === Role.MECHANIC ? { mechanicId: userId } : { userId };
        const sort = sortBy === 'asc' ? 1 : -1;

        const queryData = PretripBookingModel.find(query).sort({ createdAt: sort }).skip(start).limit(end)
            .populate('vehicleId', 'regNo brand modelName owner')
            .populate('serviceReportId', 'servicePlan.name servicePlan.description -_id')
            .select('status vehicleId schedule serviceReportId').lean();

        if (Role.MECHANIC === 'mechanic') {
            queryData.populate('userId', 'name email mobile')
        }

        const data = await queryData.lean()
        const count = await PretripBookingModel.countDocuments(query)
        return {
            history: data,
            totalDocuments: count
        }

    }

    async pretripBookingDetails(start: Date, end: Date, groupBy: GroupBy): Promise<any> {
        let groupId: any = null
        let sort: any = {}
        if (groupBy === 'day') {
            groupId = {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" }
            }
            sort = { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        } else if (groupBy === 'month') {
            groupId = {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" }
            }
            sort = { "_id.year": 1, "_id.month": 1 }
        } else if (groupBy === 'year') {
            groupId = { year: { $year: "$createdAt" } }
            sort = { "_id.year": 1 }
        }

        const pipeline: any[] = [
            {
                $match: { createdAt: { $gte: start, $lte: end } }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "payment.paymentId",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            { $unwind: { path: "$paymentDetails", preserveNullAndEmptyArrays: true } },
            {
                $match: { "paymentDetails.status": "success" }
            },
            {
                $group: {
                    _id: groupId,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$paymentDetails.amount" }
                }
            }
        ]

        if (Object.keys(sort).length > 0) {
            pipeline.push({ $sort: sort })
        }

        const result = await PretripBookingModel.aggregate(pipeline)

        if (groupBy === 'none') {
            return result[0] || { totalOrders: 0, totalAmount: 0 }
        }
        return result
    }






}