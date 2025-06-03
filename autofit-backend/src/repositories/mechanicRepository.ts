import { ObjectId } from "bson";
import { Mechanic } from "../types/mechanic";
import { IMechanicRepository } from "./interfaces/IMechanicRepository";
import { ApiError } from "../utils/apiError";
import { MechanicModel, MechanicDocument } from "../models/mechanicModel";
import { Types } from "mongoose";


export class MechanicRepository implements IMechanicRepository {

    async findAll(): Promise<MechanicDocument[] | null> {
        try {
            const mechanics = await MechanicModel.find().exec();
            return mechanics
        } catch (error) {
            throw new ApiError(`Error finding all users: ${(error as Error).message}`, 500);
        }
    }

    async create(mechanic: MechanicDocument): Promise<MechanicDocument> {
        try {
            const newMechanic = new MechanicModel({ ...mechanic });
            const savedMechanic = await newMechanic.save();
            return savedMechanic.toObject()
        } catch (error) {
            throw new ApiError(`Error creating user: ${(error as Error).message}`, 500);
        }
    }

    async findByEmail(email: string): Promise<MechanicDocument | null> {
        try {
            const mechanic = await MechanicModel.findOne({ email }).exec();
            return mechanic
        } catch (error) {
            throw new ApiError(`Error finding user by email: ${(error as Error).message}`, 500);
        }
    }

    async findById(id: ObjectId): Promise<MechanicDocument | null> {
        try {
            const mechanic = await MechanicModel.findById(id).exec();
            return mechanic
        } catch (error) {
            throw new ApiError(`Error finding user by ID: ${(error as Error).message}`, 500);
        }
    }

    async save(user: Mechanic): Promise<MechanicDocument> {
        try {
            const newMechanic = new MechanicModel(user);
            const savedMechanic = await newMechanic.save();
            return savedMechanic
        } catch (error) {
            throw new ApiError(`Error saving user: ${(error as Error).message}`, 500);
        }
    }

    async update(id: Types.ObjectId, update: Partial<MechanicDocument>): Promise<MechanicDocument> {
        try {
            const updatedMechanic = await MechanicModel.findByIdAndUpdate(id, update, { new: true }).exec();
            if (!updatedMechanic) {
                throw new ApiError(`User with ID ${id} not found`, 404);
            }
            return updatedMechanic
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error updating user: ${(error as Error).message}`, 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            const result = await MechanicModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new ApiError(`User with ID ${id} not found`, 404);
            }
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error deleting user: ${(error as Error).message}`, 500);
        }
    }

    async storeRefreshToken(userId: ObjectId, token: string): Promise<void> {
        try {
            const result = await MechanicModel.updateOne({ _id: userId }, { refreshToken: token }).exec();
            if (result.matchedCount === 0) {
                throw new ApiError(`User with ID ${userId} not found`, 404);
            }
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error storing refresh token: ${(error as Error).message}`, 500);
        }
    }

    async getRefreshToken(userId: ObjectId): Promise<string | null> {
        try {
            const mechanic = await MechanicModel.findById(userId).select('refreshToken').exec();
            if (!mechanic) {
                throw new ApiError(`User with ID ${userId} not found`, 404);
            }
            return mechanic.refreshToken || null;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error retrieving refresh token: ${(error as Error).message}`, 500);
        }
    }

    async findMechanicWithPagination(params: { page: number; limit: number; search?: string; sortField?: keyof MechanicDocument; sortOrder?: "asc" | "desc"; }): Promise<{ users: MechanicDocument[]; total: number; page: number; totalPages: number; }> {
        const { page = 1, limit = 10, search, sortField = 'createdAt', sortOrder = 'desc' } = params;

        const safeLimit = Math.min(Math.max(limit, 1), 5);
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




}