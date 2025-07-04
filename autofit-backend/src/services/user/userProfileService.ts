import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";



export class ProfileService {
    constructor(
        private _userRepository: IUserRepository,
        private _roadsideAssistanceRepo : RoadsideAssistanceRepository
    ) { }

    async updateUser({ name, email, mobile, userId }: { name: string, email: string, mobile: string, userId: Types.ObjectId }) {
        const response = await this._userRepository.findByEmail(email)
        if (response && !response._id.equals(userId)) throw new ApiError('User With Email Already Exists',400)
        return await this._userRepository.update(userId, { name, email, mobile });
    }

    async serviceHistoryByUserId(userId:Types.ObjectId){
      return await this._roadsideAssistanceRepo.findByUserId(userId)
    }

    
}