import { IAdminRepository } from "./interfaces/IAdminRepository";
import { Types } from "mongoose";
import { AdminModel, AdminDocument } from "../models/adminModel";
import { ApiError } from "../utils/apiError";
import { BaseRepository } from "./baseRepository";

export class AdminRepository extends BaseRepository<AdminDocument> implements IAdminRepository {

    constructor() {
        super(AdminModel);
    }

    async findByEmail(email: string): Promise<AdminDocument | null> {
        try {
            const admin = await AdminModel.findOne({ email }).exec();
            return admin 

        } catch (error) {
            throw new ApiError(`Error finding admin by email: ${(error as Error).message}`, 500);
        }
    }

    async getRefreshToken(userId: Types.ObjectId): Promise<string | null> {
        try {
            const admin = await AdminModel.findById(userId).select('refreshToken').exec();
            if (!admin) {
                throw new ApiError(`Admin with ID ${userId} not found`, 404);
            }
            return admin.refreshToken || null;
            
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error retrieving refresh token: ${(error as Error).message}`, 500);
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
                throw new ApiError(`Admin with ID ${userId} not found`, 404);
            }
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(`Error storing refresh token: ${(error as Error).message}`, 500);
        }
    }
}




// import { ObjectId } from "bson";
// import { IAdminRepository } from "./interfaces/IAdminRepository";
// import { Types } from "mongoose";
// import { AdminModel, AdminDocument } from "../models/adminModel";
// import { ApiError } from "../utils/apiError";

// export class AdminRepository implements IAdminRepository {
    
//     async findById(id: ObjectId): Promise<AdminDocument | null> {
//         try {
//             const admin = await AdminModel.findById(id).exec();
//             return admin 
//         } catch (error) {
//             throw new ApiError(`Error finding admin by ID: ${(error as Error).message}`, 500);
//         }
//     }

//     async findAll(): Promise<AdminDocument[] | null> {
//         try {
//             const admins = await AdminModel.find().exec();
//             return admins

//         } catch (error) {
//             throw new ApiError(`Error finding all admins: ${(error as Error).message}`, 500);
//         }
//     }

//     async save(entity: AdminDocument): Promise<AdminDocument> {
//         try {
//             const admin = new AdminModel(entity);
//             const savedAdmin = await admin.save();
//             return savedAdmin
//         } catch (error) {
//             throw new ApiError(`Error saving admin: ${(error as Error).message}`, 500);
//         }
//     }

//     async update(id: Types.ObjectId, update: Partial<AdminDocument>): Promise<AdminDocument> {
//         try {
//             const updatedAdmin = await AdminModel.findByIdAndUpdate(
//                 id,
//                 { $set: update },
//                 { new: true }
//             ).exec();
//             if (!updatedAdmin) {
//                 throw new ApiError(`Admin with ID ${id} not found`, 404);
//             }
//             return updatedAdmin 

//         } catch (error) {
//             if (error instanceof ApiError) throw error;
//             throw new ApiError(`Error updating admin: ${(error as Error).message}`, 500);
//         }
//     }

//     async delete(id:Types.ObjectId): Promise<void> {
//         try {
//             const result = await AdminModel.findByIdAndDelete(id).exec();
//             if (!result) {
//                 throw new ApiError(`Admin with ID ${id} not found`, 404);
//             }
//         } catch (error) {
//             if (error instanceof ApiError) throw error;
//             throw new ApiError(`Error deleting admin: ${(error as Error).message}`, 500);
//         }
//     }

//     async findByEmail(email: string): Promise<AdminDocument | null> {
//         try {
//             const admin = await AdminModel.findOne({ email }).exec();
//             return admin 

//         } catch (error) {
//             throw new ApiError(`Error finding admin by email: ${(error as Error).message}`, 500);
//         }
//     }

//     async getRefreshToken(userId: Types.ObjectId): Promise<string | null> {
//         try {
//             const admin = await AdminModel.findById(userId).select('refreshToken').exec();
//             if (!admin) {
//                 throw new ApiError(`Admin with ID ${userId} not found`, 404);
//             }
//             return admin.refreshToken || null;
            
//         } catch (error) {
//             if (error instanceof ApiError) throw error;
//             throw new ApiError(`Error retrieving refresh token: ${(error as Error).message}`, 500);
//         }
//     }

//     async storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void> {
//         try {
//             const result = await AdminModel.findByIdAndUpdate(
//                 userId,
//                 { $set: { refreshToken: token } },
//                 { new: true }
//             ).exec();
//             if (!result) {
//                 throw new ApiError(`Admin with ID ${userId} not found`, 404);
//             }
//         } catch (error) {
//             if (error instanceof ApiError) throw error;
//             throw new ApiError(`Error storing refresh token: ${(error as Error).message}`, 500);
//         }
//     }
// }