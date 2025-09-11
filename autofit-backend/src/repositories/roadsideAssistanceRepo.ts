// import { FilterQuery, Types } from "mongoose";
// import { RoadsideAssistanceDocument, RoadsideAssistanceModel } from "../models/roadsideAssistanceModel";
// import { IRoadsideAssistanceRepo, PagenatedHistoryParams, PagenatedResponse } from "./interfaces/IRoadsideAssistanceRepo";
// import { CreateRoadsideAssistanceDTO } from "../types/services";
// import { ApiError } from "../utils/apiError";
// import { BaseRepository } from "./baseRepository";
// import { HttpStatus } from "../types/responseCode"; import { Role } from "../types/role";
// import { DashboardRange } from "../services/admin/interface/IPageService";
// import { startOfDay, startOfYear, subDays, subYears } from "date-fns";
// ;

// export class RoadsideAssistanceRepository extends BaseRepository<RoadsideAssistanceDocument> implements IRoadsideAssistanceRepo {

//     constructor() {
//         super(RoadsideAssistanceModel);
//     }

//     async create(entity: CreateRoadsideAssistanceDTO): Promise<RoadsideAssistanceDocument> {
//         const savedDoc = await new RoadsideAssistanceModel(entity).save();

//         return await RoadsideAssistanceModel.findById(savedDoc._id)
//             .populate('userId', 'name') as RoadsideAssistanceDocument
//     }

//     async findAll(): Promise<RoadsideAssistanceDocument[]> {
//         return await RoadsideAssistanceModel.find().populate('userId mechanicId quotationId paymentId').exec();
//     }

//     async delete(id: Types.ObjectId): Promise<void> {
//         await RoadsideAssistanceModel.findByIdAndDelete(id).exec();
//     }

//     async findByUserId(userId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | []> {
//         return await RoadsideAssistanceModel.find({ userId },
//             { issue: 1, description: 1, vehicle: 1, status: 1, startedAt: 1, endedAt: 1 })
//             .sort({ createdAt: -1 })
//     }

//     async findByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | null> {
//         return await RoadsideAssistanceModel.find({ mechanicId })
//             .populate('userId mechanicId quotationId paymentId')
//             .exec();
//     }

//     async ongoingServiceByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument> {
//         return await RoadsideAssistanceModel.findOne({
//             mechanicId,
//             status: { $nin: ['completed', 'canceled'] }
//         }).populate('userId', 'name') as RoadsideAssistanceDocument;
//     }

//     async findById(id: Types.ObjectId): Promise<any> {
//         const result = await RoadsideAssistanceModel
//             .findById(id)
//             .populate('userId', 'name email mobile -_id')
//             .populate('mechanicId', 'name email avatar')
//             .populate('quotationId', '-requestId')
//             .populate('paymentId', '-userId')
//             .lean();

//         if (!result) throw new ApiError('No Service Details Found', HttpStatus.NOT_FOUND);
//         const { userId, mechanicId, ...rest } = result;

//         return {
//             ...rest,
//             user: userId,
//             mechanic: mechanicId
//         };
//     }

//     async getActiveServiceId(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
//         const services = await RoadsideAssistanceModel.find({ $or: [{ mechanicId: userId }, { userId: userId }] }).select('_id').lean()
//         return services.map(service => service._id);
//     }

//     async pagenatedRoadsideHistory({ end, start, userId, role, sortBy, search }: PagenatedHistoryParams): Promise<PagenatedResponse> {

//         const query: FilterQuery<RoadsideAssistanceDocument> =
//             role === Role.MECHANIC ? { mechanicId: userId } : { userId };

//         const sort = sortBy === "asc" ? 1 : -1;

//         if (search && search.trim() !== "") {
//             const regex = new RegExp(search, "i");
//             query.$or = [
//                 { "vehicle.regNo": regex },
//                 { "vehicle.brand": regex },
//                 { "vehicle.modelName": regex },
//                 { "vehicle.owner": regex },
//                 { status: regex },
//                 { issue: regex },
//                 { description: regex },
//             ];
//         }

//         const queryData = RoadsideAssistanceModel.find(query)
//             .sort({ createdAt: sort })
//             .skip(start)
//             .limit(end)
//             .select(
//                 "issue description vehicle status startedAt endedAt serviceLocation.coordinates"
//             )
//             .lean();

//         if (role === Role.MECHANIC) {
//             queryData.populate("userId", "name email mobile");
//         }

//         const data = await queryData.lean();
//         const count = await RoadsideAssistanceModel.countDocuments(query);

//         return {
//             history: data,
//             totalDocuments: count,
//         };
//     }


//     async roadsideAssistanceDetailsByRange(range: DashboardRange): Promise<any[]> {
//         let startDate: Date;
//         let groupId: any;

//         switch (range) {
//             case DashboardRange.DAY:
//                 startDate = startOfDay(new Date());
//                 break;

//             case DashboardRange.MONTH:
//                 startDate = subDays(new Date(), 30);
//                 groupId = {
//                     day: { $dayOfMonth: "$createdAt" },
//                     month: { $month: "$createdAt" },
//                     year: { $year: "$createdAt" }
//                 };
//                 break;

//             case DashboardRange.YEAR:
//                 startDate = subYears(startOfYear(new Date()), 4);
//                 groupId = { year: { $year: "$createdAt" } };
//                 break;

//             default:
//                 throw new Error("Invalid range");
//         }


//         const basePipeline: any[] = [
//             {
//                 $match: {
//                     createdAt: { $gte: startDate }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "payments",
//                     localField: "paymentId",
//                     foreignField: "_id",
//                     as: "payment"
//                 }
//             },
//             { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } }
//         ];

//         if (range === DashboardRange.DAY) {
//             const todayResult = await RoadsideAssistanceModel.aggregate([
//                 ...basePipeline,
//                 {
//                     $group: {
//                         _id: null,
//                         totalOrders: { $sum: 1 },
//                         totalAmount: { $sum: "$payment.amount" }
//                     }
//                 }
//             ]);

//             return todayResult[0] || { totalOrders: 0, totalAmount: 0 };
//         }

//         const result = await RoadsideAssistanceModel.aggregate([
//             ...basePipeline,
//             {
//                 $group: {
//                     _id: groupId,
//                     totalOrders: { $sum: 1 },
//                     totalAmount: { $sum: "$payment.amount" }
//                 }
//             },
//             { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
//         ]);

//         return result;
//     }


// }






import { FilterQuery, Types } from "mongoose";
import { RoadsideAssistanceDocument, RoadsideAssistanceModel } from "../models/roadsideAssistanceModel";
import { IRoadsideAssistanceRepo, PagenatedHistoryParams, PagenatedResponse } from "./interfaces/IRoadsideAssistanceRepo";
import { CreateRoadsideAssistanceDTO } from "../types/services";
import { ApiError } from "../utils/apiError";
import { BaseRepository } from "./baseRepository";
import { HttpStatus } from "../types/responseCode"; import { Role } from "../types/role";
import { GroupBy } from "../services/admin/interface/IPageService";

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

    async pagenatedRoadsideHistory({ end, start, userId, role, sortBy, search }: PagenatedHistoryParams): Promise<PagenatedResponse> {

        const query: FilterQuery<RoadsideAssistanceDocument> =
            role === Role.MECHANIC ? { mechanicId: userId } : { userId };

        const sort = sortBy === "asc" ? 1 : -1;

        if (search && search.trim() !== "") {
            const regex = new RegExp(search, "i");
            query.$or = [
                { "vehicle.regNo": regex },
                { "vehicle.brand": regex },
                { "vehicle.modelName": regex },
                { "vehicle.owner": regex },
                { status: regex },
                { issue: regex },
                { description: regex },
            ];
        }

        const queryData = RoadsideAssistanceModel.find(query)
            .sort({ createdAt: sort })
            .skip(start)
            .limit(end)
            .select(
                "issue description vehicle status startedAt endedAt serviceLocation.coordinates"
            )
            .lean();

        if (role === Role.MECHANIC) {
            queryData.populate("userId", "name email mobile");
        }

        const data = await queryData.lean();
        const count = await RoadsideAssistanceModel.countDocuments(query);

        return {
            history: data,
            totalDocuments: count,
        };
    }


    async roadsideAssistanceDetails(start: Date, end: Date, groupBy: GroupBy): Promise<any> {
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
                $lookup: {
                    from: "payments",
                    localField: "paymentId",
                    foreignField: "_id",
                    as: "payment"
                }
            },
            { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: groupId,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$payment.amount" }
                }
            }
        ]

        if (Object.keys(sort).length > 0) {
            pipeline.push({ $sort: sort })
        }

        const result = await RoadsideAssistanceModel.aggregate(pipeline)

        if (groupBy === 'none') {
            return result[0] || { totalOrders: 0, totalAmount: 0 }
        }
        return result
    }

}