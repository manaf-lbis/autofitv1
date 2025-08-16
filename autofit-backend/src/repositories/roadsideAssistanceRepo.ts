import { Types } from "mongoose";
import { RoadsideAssistanceDocument, RoadsideAssistanceModel } from "../models/roadsideAssistanceModel";
import { IRoadsideAssistanceRepo, PagenatedHistoryParams, PagenatedResponse } from "./interfaces/IRoadsideAssistanceRepo";
import { CreateRoadsideAssistanceDTO } from "../types/services";
import { ApiError } from "../utils/apiError";
import { BaseRepository } from "./baseRepository";
import { HttpStatus } from "../types/responseCode"; import { Role } from "../types/role";
;

export class RoadsideAssistanceRepository extends BaseRepository<RoadsideAssistanceDocument> implements IRoadsideAssistanceRepo {

    constructor() {
        super(RoadsideAssistanceModel);
    }

    async create(entity: CreateRoadsideAssistanceDTO): Promise<RoadsideAssistanceDocument> {
        const savedDoc = await new RoadsideAssistanceModel(entity).save();

        return await RoadsideAssistanceModel.findById(savedDoc._id)
            .populate('userId', 'name') as RoadsideAssistanceDocument
    }

    async findAll(): Promise<RoadsideAssistanceDocument[]> {
        return await RoadsideAssistanceModel.find().populate('userId mechanicId quotationId paymentId').exec();
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await RoadsideAssistanceModel.findByIdAndDelete(id).exec();
    }

    async findByUserId(userId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | []> {
        return await RoadsideAssistanceModel.find({ userId },
            { issue: 1, description: 1, vehicle: 1, status: 1, startedAt: 1, endedAt: 1 })
            .sort({ createdAt: -1 })
    }

    async findByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | null> {
        return await RoadsideAssistanceModel.find({ mechanicId })
            .populate('userId mechanicId quotationId paymentId')
            .exec();
    }

    async ongoingServiceByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument> {
        return await RoadsideAssistanceModel.findOne({
            mechanicId,
            status: { $nin: ['completed', 'canceled'] }
        }).populate('userId', 'name') as RoadsideAssistanceDocument;
    }

    async findById(id: Types.ObjectId): Promise<any> {
        const result = await RoadsideAssistanceModel
            .findById(id)
            .populate('userId', 'name email mobile -_id')
            .populate('mechanicId', 'name email avatar')
            .populate('quotationId', '-requestId')
            .populate('paymentId', '-userId')
            .lean();

        if (!result) throw new ApiError('No Service Details Found', HttpStatus.NOT_FOUND);
        const { userId, mechanicId, ...rest } = result;

        return {
            ...rest,
            user: userId,
            mechanic: mechanicId
        };
    }

    async getActiveServiceId(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
        const services = await RoadsideAssistanceModel.find({ $or: [{ mechanicId: userId }, { userId: userId }] }).select('_id').lean()
        return services.map(service => service._id);
    }

    async pagenatedRoadsideHistory({ end, start, userId, role, sortBy }: PagenatedHistoryParams): Promise<PagenatedResponse> {

        const query = role === Role.MECHANIC ? { mechanicId: userId } : { userId };
        const sort = sortBy === 'asc' ? 1 : -1;
        const data = await RoadsideAssistanceModel.find(query).sort({ createdAt: sort }).skip(start).limit(end)
            .select('issue description vehicle status startedAt endedAt location.coordinates').lean();
        const count = await RoadsideAssistanceModel.countDocuments(query)
        return {
            history: data,
            totalDocuments: count
        }
    }



}
