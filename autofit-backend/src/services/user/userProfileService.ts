import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { IUserProfileService, liveAssistanceServiceHistoryResponse, PretripServiceHistoryResponse } from "./Interface/IUserProfileService";
import { HttpStatus } from "../../types/responseCode";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { Role } from "../../types/role";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { ILiveAssistanceRepository } from "../../repositories/interfaces/ILiveAssistanceRepository";
import { UserMapper } from "../../dtos/userDto";
import { RoadsideAssistanceMapper } from "../../dtos/roadsideAssistanceDTO";
import { PretripMapper } from "../../dtos/pretripDto";
import { LiveAssistanceMapper } from "../../dtos/liveAssistanceDTO";



export class UserProfileService implements IUserProfileService {
    constructor(
        private _userRepository: IUserRepository,
        private _roadsideAssistanceRepo : IRoadsideAssistanceRepo,
        private _pretripBookingRepository: IPretripBookingRepository,
        private _liveAssistanceRepository: ILiveAssistanceRepository
    ) { }

    async updateUser({ name, email, mobile, userId }: { name: string, email: string, mobile: string, userId: Types.ObjectId }) {
        const response = await this._userRepository.findByEmail(email)
        if (response && !response._id.equals(userId)) throw new ApiError('User With Email Already Exists',HttpStatus.BAD_REQUEST)
        const user = await this._userRepository.update(userId, { name, email, mobile });
        if (!user) throw new ApiError('Invalid User');
        return UserMapper.toUserBasicInfo(user)
    }


    async roadsideServiceHistory(userId:Types.ObjectId, page:number){
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ?  0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const response = await this._roadsideAssistanceRepo.pagenatedRoadsideHistory({end,start,userId,role:Role.USER,sortBy:'desc'})

        return {
            totalDocuments: response.totalDocuments,
            hasMore : response.totalDocuments > end,
            history: response.history.map((item) => {
                return RoadsideAssistanceMapper.toRoadsideAssistanceInfo(item)
            })
        }
    }

    async pretripServiceHistory(userId: Types.ObjectId, page: number): Promise<PretripServiceHistoryResponse> {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ?  0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const response = await this._pretripBookingRepository.pagenatedPretripHistory({end,start,userId,role:Role.USER,sortBy:'desc'})
    
        return {
            totalDocuments: response.totalDocuments,
            hasMore : response.totalDocuments > end,
            history: response.history.map((item) => {
                return PretripMapper.toPretripInfo(item)
            })
        }
        
    }

    async liveAssistanceServiceHistory(userId: Types.ObjectId, page: number): Promise<liveAssistanceServiceHistoryResponse> {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ?  0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const response = await this._liveAssistanceRepository.pagenatedLiveAssistanceHistory({end,start,userId,role:Role.USER,sortBy:'desc'})
    
        return {
            totalDocuments: response.totalDocuments,
            hasMore : response.totalDocuments > end,
            history: response.history.map((item) => {
                return LiveAssistanceMapper.toLiveAssistanceInfo(item)
            })
        }
    }

    
}
