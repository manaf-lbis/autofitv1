import { Types } from "mongoose";
import { MechanicDocument } from "../../models/mechanicModel";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IMechanicService, PagenateParams } from "./interface/IMechanicServices";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { MechanicMapper } from "../../dtos/mechnaicDTO";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { MechanicProfileMapper } from "../../dtos/mechanicProfileDTO";


export class MechanicService implements IMechanicService {
    constructor(
        private _mechanicRepository: IMechanicRepository,
        private _mechanicprofileRepository: IMechanicProfileRepository
    ) { }

    async allUsers(data: PagenateParams<MechanicDocument>) {
        const result = await this._mechanicRepository.findMechanicWithPagination(data)
        return {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            users: result.users.map((mech) => MechanicMapper.toAdminMechanic(mech))
        }
    }

    async updataUser({ userId, data }: { userId: Types.ObjectId, data: Partial<MechanicDocument> }) {
        await this._mechanicRepository.update(userId, data)
    }

    async mechanicDetails({ userId }: { userId: Types.ObjectId }) {
        const mechanic = await this._mechanicRepository.getBasicUserById(userId);
        let mechanicProfile = await this._mechanicprofileRepository.findByMechanicId(userId);
        if(!mechanic) throw new ApiError("Mechanic not found", HttpStatus.NOT_FOUND);

        return {
            mechanic :  MechanicMapper.toAdminMechanic(mechanic) ,
            mechanicProfile : mechanicProfile ? MechanicProfileMapper.toMechnaicProfileDetails(mechanicProfile) : null
        };
    }

    async mechanicApplications(params: PagenateParams<MechanicProfileDocument>): Promise<any> {

        const result = await this._mechanicprofileRepository.findMechanicWithPagination(params);
        
        return {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            users: result.users.map((mech) => MechanicProfileMapper.toMechanicProfileBasicDetails(mech))
        };
    }



}