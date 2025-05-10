import { User } from "../types/user";
import { IUserRepository } from "./interfaces/IUserRepository";
import { UserModel } from "../models/userModel";
import { CreateUserInput } from "../types/user/userInput";
import { ObjectId } from "mongodb";
import { ApiError } from "../utils/apiError"; 

export class UserRepository implements IUserRepository {
    async findAll(): Promise<User[] | null> {
        try {
            const users = await UserModel.find().exec();
            return users as User[] | null;
        } catch (error) {
            throw new ApiError(`Error finding all users: ${(error as Error).message}`, 500);
        }
    }

    async create(user: CreateUserInput): Promise<User> {
        try {
            const newUser = new UserModel({ ...user });
            const savedUser = await newUser.save();
            return savedUser.toObject() as User;
        } catch (error) {
            throw new ApiError(`Error creating user: ${(error as Error).message}`, 500);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email }).exec();
            return user as User | null;
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

    async update(id: string, update: Partial<User>): Promise<User | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, update, { new: true }).exec();
            if (!updatedUser) {
                throw new ApiError(`User with ID ${id} not found`, 404);
            }
            return updatedUser as User | null;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error updating user: ${(error as Error).message}`, 500);
        }
    }

    async delete(id: string): Promise<void> {
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
}