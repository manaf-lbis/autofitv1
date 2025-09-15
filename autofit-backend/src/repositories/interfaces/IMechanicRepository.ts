import { Types } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { MechanicDocument } from "../../models/mechanicModel";

export interface IMechanicRepository extends IBaseRepository<MechanicDocument> {

    findByEmail(email: string): Promise<MechanicDocument | null>
    findAllByEmail(email: string): Promise<MechanicDocument[]>
    getRefreshToken(userId: Types.ObjectId): Promise<string | null>
    storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void>
    findMechanicWithPagination(params: {
        page: number;
        limit: number;
        search?: string;
        sortField?: keyof MechanicDocument;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        users: MechanicDocument[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getBasicUserById(id: Types.ObjectId): Promise<MechanicDocument| null>;
    overallMechanicStatusSummary(): Promise<any>;
}