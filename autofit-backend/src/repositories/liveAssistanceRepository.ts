import { Types } from "mongoose";
import { LiveAssistanceDocument, LiveAssistanceModel } from "../models/liveAssistanceModel";
import { BaseRepository } from "./baseRepository";
import { ILiveAssistanceRepository, PagenatedHistoryParams, PagenatedResponse } from "./interfaces/ILiveAssistanceRepository";
import { Role } from "../types/role";
import { LiveAssistanceStatus } from "../types/liveAssistance";
import { GroupBy } from "../services/admin/interface/IPageService";

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

    async liveAssistanceDetails(start: Date, end: Date, groupBy: GroupBy): Promise<any> {
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
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: groupId,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$price" }
                }
            }
        ]

        if (Object.keys(sort).length > 0) {
            pipeline.push({ $sort: sort })
        }

        const result = await LiveAssistanceModel.aggregate(pipeline)

        if (groupBy === 'none') {
            return result[0] || { totalOrders: 0, totalAmount: 0 }
        }
        return result
    }

    async findLatest(start?: Date, end?: Date): Promise<LiveAssistanceDocument[]> {
        let query = LiveAssistanceModel.find()
        if (start) query = query.gte('createdAt', start)
        if (end) query = query.lte('createdAt', end)
        return await query.sort({ createdAt: -1 }).limit(10).populate('userId', 'name -_id').select('userId price createdAt status')
    }

}