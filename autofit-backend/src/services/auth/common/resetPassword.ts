import { ApiError } from "../../../utils/apiError";
import { User } from "../../../types/user";
import { Admin } from "../../../types/admin";
import { Role } from "../../../types/role";
import { OtpService } from "../../otp/otpService";
import { HashService } from "../../hash/hashService";

import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { IAdminRepository } from "../../../repositories/interfaces/IAdminRepository";
import { Types } from "mongoose";

class ResetPassword {
    constructor(
        private userRepository: IUserRepository,
        private adminRepository: IAdminRepository,
        private otpService: OtpService,
        private hashService: HashService
    ) { }

    async verifyEmail(email: string, role: Role) {

        let user: User | Admin | null

        switch (role) {
            case 'user':
                user = await this.userRepository.findByEmail(email)
                break;

            case 'admin':
                user = await this.adminRepository.findByEmail(email)
                break;

            default:

                throw new ApiError('User Not found')
        }

        if (user === null) throw new ApiError('User Not found')

        return user
    }

    async saveAndSentOtp(email: string, role: Role) {
        await this.otpService.saveAndSentOtp(email,role)
        return true
    };

    async updatePassword(email:string,password:string,role:Role,_id:Types.ObjectId){

        let user: User | Admin | null

        const hash = await this.hashService.hash(password)

        switch (role) {
            case 'user':
                user = await this.userRepository.update(_id,{password:hash})
                break;

            case 'admin':
                user = await this.adminRepository.update(_id,{password:hash})
                break;

            default:
                throw new ApiError('User Not found')
        }

    }




}

export default ResetPassword