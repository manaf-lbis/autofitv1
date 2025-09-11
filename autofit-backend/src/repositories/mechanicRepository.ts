import { ObjectId } from "bson";
import { IMechanicRepository } from "./interfaces/IMechanicRepository";
import { ApiError } from "../utils/apiError";
import { MechanicModel, MechanicDocument } from "../models/mechanicModel";
import { Types } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { HttpStatus } from "../types/responseCode";


export class MechanicRepository extends BaseRepository<MechanicDocument> implements IMechanicRepository {

    constructor(){
        super(MechanicModel)
    }

    async findByEmail(email: string): Promise<MechanicDocument | null> {
        try {
            const mechanic = await MechanicModel.findOne({ email }).exec();
            return mechanic
        } catch (error) {
            throw new ApiError(`Error finding user by email: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async storeRefreshToken(userId: ObjectId, token: string): Promise<void> {
        try {
            const result = await MechanicModel.updateOne({ _id: userId }, { refreshToken: token }).exec();
            if (result.matchedCount === 0) {
                throw new ApiError(`User with ID ${userId} not found`, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error storing refresh token: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRefreshToken(userId: ObjectId): Promise<string | null> {
        try {
            const mechanic = await MechanicModel.findById(userId).select('refreshToken').exec();
            if (!mechanic) {
                throw new ApiError(`User with ID ${userId} not found`, HttpStatus.NOT_FOUND);
            }
            return mechanic.refreshToken || null;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error retrieving refresh token: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findMechanicWithPagination(params: { page: number; limit: number; search?: string; sortField?: keyof MechanicDocument; sortOrder?: "asc" | "desc"; }): Promise<{ users: MechanicDocument[]; total: number; page: number; totalPages: number; }> {
        const { page = 1, limit = 10, search, sortField = 'createdAt', sortOrder = 'desc' } = params;

        const safeLimit = Math.min(Math.max(limit, 1), Number(process.env.ITEMS_PER_PAGE));
        const skip = (page - 1) * safeLimit;


        const query: any = {};
        if (search && search.trim()) {
            const sanitizedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { name: { $regex: sanitizedSearch, $options: 'i' } },
                { email: { $regex: sanitizedSearch, $options: 'i' } },
            ];
        }

        const sort: any = {};
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;

        try {
            const [users, total] = await Promise.all([
                MechanicModel.find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(safeLimit)
                    .select('_id name email role mobile status')
                    .exec(),
                MechanicModel.countDocuments(query).exec(),
            ]);

            return {
                users,
                total,
                page,
                totalPages: Math.ceil(total / safeLimit)
            };
        } catch (error) {
            throw new ApiError(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getBasicUserById(id: Types.ObjectId): Promise<MechanicDocument | null> {
         return await MechanicModel.findById(id)
            .select("name email mobile role status")
            .exec();
    }


    async overallMechanicStatusSummary(): Promise<any> {
        return await MechanicModel.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        
    }


}

