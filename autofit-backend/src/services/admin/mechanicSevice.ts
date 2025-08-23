import { Types } from "mongoose";
import { MechanicDocument } from "../../models/mechanicModel";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IMechanicService, PagenateParams, PaginationResponse } from "./interface/IMechanicServices";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { AdminMapper } from "../../utils/mappers/adminMapper";



export class MechanicService implements IMechanicService {
    constructor(
        private _mechanicRepository: IMechanicRepository,
        private _mechanicprofileRepository: IMechanicProfileRepository
    ) { }

    async allUsers(data: PagenateParams<MechanicDocument> ) {
        return await this._mechanicRepository.findMechanicWithPagination(data)
    }

    async updataUser({ userId, data  }: { userId: Types.ObjectId, data: Partial<MechanicDocument> }) {
        await this._mechanicRepository.update(userId, data)
    }

    async mechanicDetails({ userId }: { userId: Types.ObjectId }) {
        const mechanic = await this._mechanicRepository.getBasicUserById(userId);
        let mechanicProfile = await this._mechanicprofileRepository.findByMechanicId(userId);
        return { mechanic, mechanicProfile };
    }

    async mechanicApplications(params: PagenateParams<MechanicProfileDocument>): Promise<PaginationResponse> {
        const result = await this._mechanicprofileRepository.findMechanicWithPagination(params);
        return result;
    }



}