import { User } from "../types/user/user";
import { IUserRepository } from "./interfaces/IUserRepository";
import { UserModel, UserDocument } from "../models/userModel";
import { CreateUserInput } from "../types/user/userInput";
import { ObjectId } from "mongodb";
import { ApiError } from "../utils/apiError";
import { Types } from "mongoose";

export class UserRepository implements IUserRepository {

    async findAll(): Promise<UserDocument[] | null> {
        try {
            const users = await UserModel.find().exec();
            return users
        } catch (error) {
            throw new ApiError(`Error finding all users: ${(error as Error).message}`, 500);
        }
    }

    async create(user: CreateUserInput): Promise<UserDocument> {
        try {
            const newUser = new UserModel({ ...user });
            const savedUser = await newUser.save();
            return savedUser.toObject()
        } catch (error) {
            throw new ApiError(`Error creating user: ${(error as Error).message}`, 500);
        }
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findOne({ email }).exec();
            return user
        } catch (error) {
            throw new ApiError(`Error finding user by email: ${(error as Error).message}`, 500);
        }
    }

    async findById(id: ObjectId): Promise<User | null> {
        try {
            const user = await UserModel.findById(id).exec();
            return user as User | null;
        } catch (error) {
            throw new ApiError(`Error finding user by ID: ${(error as Error).message}`, 500);
        }
    }

    async save(user: User): Promise<User> {
        try {
            const newUser = new UserModel(user);
            const savedUser = await newUser.save();
            return savedUser as User;
        } catch (error) {
            throw new ApiError(`Error saving user: ${(error as Error).message}`, 500);
        }
    }

    async update(id: Types.ObjectId, update: Partial<User>): Promise<User> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, update, { new: true }).exec();
            if (!updatedUser) {
                throw new ApiError(`User with ID ${id} not found`, 404);
            }
            return updatedUser;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error updating user: ${(error as Error).message}`, 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            const result = await UserModel.findByIdAndDelete(id).exec();
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
            const result = await UserModel.updateOne({ _id: userId }, { refreshToken: token }).exec();
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
            const user = await UserModel.findById(userId).select('refreshToken').exec();
            if (!user) {
                throw new ApiError(`User with ID ${userId} not found`, 404);
            }
            return user.refreshToken || null;

        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error retrieving refresh token: ${(error as Error).message}`, 500);
        }
    }

    async findUsersWithPagination(params: { page: number; limit: number; search?: string; sortField?: keyof User; sortOrder?: "asc" | "desc"; }): Promise<{ users: UserDocument[]; total: number; page: number; totalPages: number; }> {
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
                UserModel.find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(safeLimit)
                    .select('_id name email role mobile status')
                    .exec(),
                UserModel.countDocuments(query).exec(),
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

    async getBasicUserById(id: Types.ObjectId): Promise<UserDocument| null> {
        return await UserModel.findById(id)
            .select("name email mobile role status")
            .exec();
    }


}