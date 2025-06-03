import { Types } from "mongoose";
import { MechanicDocument } from "../../models/mechanicModel";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { ApiError } from "../../utils/apiError";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortField?: keyof MechanicProfileDocument;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationResponse {
  users: MechanicProfileDocument[];
  total: number;
  page: number;
  totalPages: number;
}

export class MechanicService {
    constructor(
        private mechanicRepository: IMechanicRepository,
        private mechanicprofileRepository: IMechanicProfileRepository

    ) { }


    async allUsers(data: { page: number; limit: number; search?: string; sortField?: keyof MechanicDocument; sortOrder?: "asc" | "desc"; }) {

        return await this.mechanicRepository.findMechanicWithPagination(data)
    }

    async updataUser({ userId, data }: { userId: Types.ObjectId, data: Partial<MechanicDocument> }) {
        await this.mechanicRepository.update(userId, data)
    }


    async mechanicDetails({ userId }: { userId: Types.ObjectId }) {
       const mechanic = await this.mechanicRepository.getBasicUserById(userId)
       const mechanicProfile = await this.mechanicprofileRepository.findByMechanicId(userId)

       return {mechanic,mechanicProfile}
    }

    async mechanicApplications(params: PaginationParams): Promise<PaginationResponse> {
        const result = await this.mechanicprofileRepository.findMechanicWithPagination(params);
        return result;
    }



}