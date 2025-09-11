import { IBaseRepository } from "./IBaseRepository"
import { User } from "../../types/user/user"
import { Types } from "mongoose"
import { UserDocument } from "../../models/userModel"

export interface PagenateParams {
    page: number;
    limit: number;
    search?: string;
    sortField?: keyof User;
    sortOrder?: 'asc' | 'desc';
}

export interface PagenatedResult {
    users: UserDocument[];
    total: number;
    page: number;
    totalPages: number
}

export interface IUserRepository extends IBaseRepository<UserDocument> {

    findByEmail(email: string): Promise<UserDocument | null>
    getRefreshToken(userId: Types.ObjectId): Promise<string | null>
    storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void>
    findUsersWithPagination(params: PagenateParams): Promise<PagenatedResult>;
    getBasicUserById(id: Types.ObjectId): Promise<UserDocument | null>;
    overallUserStatusSummary(): Promise<any>

}
