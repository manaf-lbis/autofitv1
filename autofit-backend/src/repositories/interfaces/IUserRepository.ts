import { IBaseRepository } from "./IBaseRepository"
import { User } from "../../types/user/user"
import { Types } from "mongoose"
import { UserDocument } from "../../models/userModel"


export interface IUserRepository extends IBaseRepository<UserDocument> {

    findByEmail(email: string): Promise<UserDocument | null>
    getRefreshToken(userId: Types.ObjectId): Promise<string | null>
    storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void>
    findUsersWithPagination(params: {
        page: number;
        limit: number;
        search?: string;
        sortField?: keyof User;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        users: UserDocument[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getBasicUserById(id: Types.ObjectId): Promise<UserDocument| null>;
}
