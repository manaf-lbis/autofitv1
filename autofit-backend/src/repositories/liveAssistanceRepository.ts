import { Types } from "mongoose";
import { LiveAssistanceDocument, LiveAssistanceModel } from "../models/liveAssistanceModel";
import { BaseRepository } from "./baseRepository";
import { ILiveAssistanceRepository, PagenatedHistoryParams, PagenatedResponse } from "./interfaces/ILiveAssistanceRepository";
import { Role } from "../types/role";
import { LiveAssistanceStatus } from "../types/liveAssistance";
import { DashboardRange } from "../services/admin/interface/IPageService";
import { startOfDay, startOfYear, subDays, subYears } from "date-fns";

export class LiveAsistanceRepository extends BaseRepository<LiveAssistanceDocument> implements ILiveAssistanceRepository {

    constructor() {
        super(LiveAssistanceModel);
    }

    async checkoutDetails(serviceId: Types.ObjectId): Promise<any> {
        return await LiveAssistanceModel.findOne({ _id: serviceId })
    }

    async detailedBooking(serviceId: Types.ObjectId): Promise<any> {
        return await LiveAssistanceModel.findOne({ _id: serviceId }).populate('paymentId').populate('userId', '_id name email mobile')
    }


    async pagenatedLiveAssistanceHistory({ end, start, userId, role, sortBy }: PagenatedHistoryParams): Promise<PagenatedResponse> {

        const query = role === Role.MECHANIC ? { mechanicId: userId } : { userId };
        const sort = sortBy === 'asc' ? 1 : -1;
        const data = await LiveAssistanceModel.find(query).sort({ createdAt: sort }).skip(start).limit(end)
            .populate(`${Role.MECHANIC === role ? 'userId' : 'mechanicId'}`, 'name email').populate('paymentId', 'status amount method receipt paymentId')
            .select('issue description status startTime endTime mechanicId paymentId price').lean();
        const count = await LiveAssistanceModel.countDocuments(query)
        return {
            history: data,
            totalDocuments: count
        }

    }


    async getServiceDetails(serviceId: Types.ObjectId): Promise<any> {
        return await LiveAssistanceModel.findOne({ _id: serviceId }).populate('paymentId', 'status amount methord receipt').populate('mechanicId', 'name email')
            .select('paymentId mechanicId userId issue description status startTime endTime price')
    }

    async activeBookingsByMechanicId(mechanicId: Types.ObjectId): Promise<LiveAssistanceDocument | null> {
        return await LiveAssistanceModel.findOne({
            mechanicId, status: { $in: [LiveAssistanceStatus.ONGOING, LiveAssistanceStatus.PENDING] },
            startTime: { $lte: new Date() },
            endTime: { $gte: new Date() }
        }).populate('userId', 'name mobile').select('userId issue description status startTime endTime price sessionId mechanicId')
    }

    async liveAssistanceDetailsByRange(range: DashboardRange): Promise<any[]> {
        let startDate: Date;
        let groupId: any;

        switch (range) {
            case DashboardRange.DAY:
                startDate = startOfDay(new Date());
                groupId = null;
                break;

            case DashboardRange.MONTH:
                startDate = subDays(new Date(), 30); 
                groupId = {
                    day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                };
                break;

            case DashboardRange.YEAR:
                startDate = subYears(startOfYear(new Date()), 4);
                groupId = { year: { $year: "$createdAt" } };
                break;

            default:
                throw new Error("Invalid range");
        }

        const pipeline: any[] = [
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: groupId,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ];

        if (range === DashboardRange.DAY) {
            const todayResult = await LiveAssistanceModel.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalAmount: { $sum: "$price" }
                    }
                }
            ]);
            return todayResult[0] || { totalOrders: 0, totalAmount: 0 };
        }

        return await LiveAssistanceModel.aggregate(pipeline);
    }

    async findLatest(): Promise<LiveAssistanceDocument[]> {
        return await LiveAssistanceModel.find()
        .sort({ createdAt: -1 }).limit(10).populate('userId','name -_id')
        .select('userId price createdAt')
    }

}