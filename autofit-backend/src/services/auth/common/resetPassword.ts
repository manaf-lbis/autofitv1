import { AdminRepository } from "../../../repositories/adminRepository";
import { UserRepository } from "../../../repositories/userRepository";
import { ApiError } from "../../../utils/apiError";
import { User } from "../../../types/user";
import { Admin } from "../../../types/admin";
import { Role } from "../../../types/role";
import { OtpService } from "../../otp/otpService";
import { OtpRepository } from "../../../repositories/otpRepository";
import { HashService } from "../../hash/hashService";
import { emailValidation } from "../../../validation/authValidation";

class ResetPassword {
    constructor(
        private userRepository: UserRepository,
        private adminRepository: AdminRepository,
        private otpService: OtpService,
        private otpRepository: OtpRepository,
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

    async updatePassword(email:string,password:string,role:Role,_id:string){

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