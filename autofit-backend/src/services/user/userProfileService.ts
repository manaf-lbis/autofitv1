import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";



export class ProfileService {
    constructor(
        private userRepository: IUserRepository,
        private roadsideAssistanceRepo : RoadsideAssistanceRepository
    ) { }

    async updateUser({ name, email, mobile, userId }: { name: string, email: string, mobile: string, userId: Types.ObjectId }) {
        const response = await this.userRepository.findByEmail(email)
        if (response && !response._id.equals(userId)) throw new ApiError('User With Email Already Exists',400)
        return await this.userRepository.update(userId, { name, email, mobile });
    }

    async serviceHistoryByUserId(userId:Types.ObjectId){
      return await this.roadsideAssistanceRepo.findByUserId(userId)
    }

    
}