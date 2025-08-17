import { Types } from "mongoose";
import { LiveAssistanceDocument, LiveAssistanceModel } from "../models/liveAssistanceModel";
import { BaseRepository } from "./baseRepository";
import { ILiveAssistanceRepository, PagenatedHistoryParams, PagenatedResponse } from "./interfaces/ILiveAssistanceRepository";
import { Role } from "../types/role";
import { LiveAssistanceStatus } from "../types/liveAssistance";

export class LiveAsistanceRepository extends BaseRepository<LiveAssistanceDocument> implements ILiveAssistanceRepository {

    constructor (){
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
        const data = await LiveAssistanceModel.find(query).sort({ createdAt: sort }).skip(start).limit(end).lean()
        .populate('mechanicId', 'name email').populate('paymentId','status amount methord receipt paymentId')
        .select('issue description status startTime endTime mechanicId paymentId price').lean();
        const count = await LiveAssistanceModel.countDocuments(query)
        return {
            history: data,
            totalDocuments: count
        }
    }

    async getServiceDetails(serviceId: Types.ObjectId): Promise<any> {
        return await LiveAssistanceModel.findOne({ _id: serviceId }).populate('paymentId','status amount methord receipt').populate('mechanicId', 'name email')
        .select('paymentId mechanicId userId issue description status startTime endTime price')
    }

    async activeBookingsByMechanicId(mechanicId: Types.ObjectId): Promise<LiveAssistanceDocument | null> {
        return await LiveAssistanceModel.findOne({ mechanicId , status: { $in: [LiveAssistanceStatus.ONGOING, LiveAssistanceStatus.PENDING] }})
        .populate('userId', 'name mobile').select('userId issue description status startTime endTime price sessionId')
    }

}