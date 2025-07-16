import { IAdminRepository } from "./interfaces/IAdminRepository";
import { Types } from "mongoose";
import { AdminModel, AdminDocument } from "../models/adminModel";
import { ApiError } from "../utils/apiError";
import { BaseRepository } from "./baseRepository";
import { HttpStatus } from "../types/responseCode";

export class AdminRepository extends BaseRepository<AdminDocument> implements IAdminRepository {

    constructor() {
        super(AdminModel);
    }

    async findByEmail(email: string): Promise<AdminDocument | null> {
        try {
            const admin = await AdminModel.findOne({ email }).exec();
            return admin 

        } catch (error) {
            throw new ApiError(`Error finding admin by email: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRefreshToken(userId: Types.ObjectId): Promise<string | null> {
        try {
            const admin = await AdminModel.findById(userId).select('refreshToken').exec();
            if (!admin) {
                throw new ApiError(`Admin with ID ${userId} not found`, HttpStatus.NOT_FOUND);
            }
            return admin.refreshToken || null;
            
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error retrieving refresh token: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void> {
        try {
            const result = await AdminModel.findByIdAndUpdate(
                userId,
                { $set: { refreshToken: token } },
                { new: true }
            ).exec();
            if (!result) {
                throw new ApiError(`Admin with ID ${userId} not found`, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error storing refresh token: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
