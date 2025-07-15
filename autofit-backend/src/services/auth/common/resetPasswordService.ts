import { ApiError } from "../../../utils/apiError";
import { User } from "../../../types/user/user";
import { Admin } from "../../../types/admin";
import { Role } from "../../../types/role";
import { OtpService } from "../../otp/otpService";
import { HashService } from "../../hash/hashService";
import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { IAdminRepository } from "../../../repositories/interfaces/IAdminRepository";
import { Types } from "mongoose";
import { IResetPasswordService } from "./interface/IResetPasswordService";

class ResetPassword implements IResetPasswordService {
    constructor(
        private _userRepository: IUserRepository,
        private _adminRepository: IAdminRepository,
        private _otpService: OtpService,
        private _hashService: HashService
    ) { }

    async verifyEmail(email: string, role: Role) {

        let user: User | Admin | null

        switch (role) {
            case 'user':
                user = await this._userRepository.findByEmail(email)
                break;

            case 'admin':
                user = await this._adminRepository.findByEmail(email)
                break;

            default:

                throw new ApiError('User Not found')
        }

        if (user === null) throw new ApiError('User Not found')

        return user
    }

    async saveAndSentOtp(email: string, role: Role) {
        await this._otpService.saveAndSentOtp(email,role)
        return true
    };

    async updatePassword(email:string,password:string,role:Role,_id:Types.ObjectId){

        const hash = await this._hashService.hash(password)

        switch (role) {
            case 'user':
                 await this._userRepository.update(_id,{password:hash})
                break;

            case 'admin':
                 await this._adminRepository.update(_id,{password:hash})
                break;

            default:
                throw new ApiError('User Not found')
        }

    }




}

export default ResetPassword