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
import { IMechanicRepository } from "../../../repositories/interfaces/IMechanicRepository";
import { Mechanic } from "../../../types/mechanic/mechanic";
import { HttpStatus } from "../../../types/responseCode";

class ResetPassword implements IResetPasswordService {
    constructor(
        private _userRepository: IUserRepository,
        private _adminRepository: IAdminRepository,
        private _otpService: OtpService,
        private _hashService: HashService,
        private _mechnaicRepository: IMechanicRepository
    ) { }

    async verifyEmail(email: string, role: Role) {

        let user: User | Admin | Mechanic | null

        switch (role) {
            case Role.USER:
                user = await this._userRepository.findByEmail(email)
                break;

            case Role.ADMIN:
                user = await this._adminRepository.findByEmail(email)
                break;

            case Role.MECHANIC:
                user = await this._mechnaicRepository.findByEmail(email);
                break;

            default:
                throw new ApiError('User Not found')
        }

        if (user === null) throw new ApiError('User Not found')

        return user
    }

    async saveAndSentOtp(email: string, role: Role) {
        await this._otpService.saveAndSentOtp(email, role)
        return true
    };

    async updatePassword(email: string, password: string, role: Role, _id: Types.ObjectId) {

        const hash = await this._hashService.hash(password)

        switch (role) {
            case Role.USER:
                await this._userRepository.update(_id, { password: hash })
                break;

            case Role.ADMIN:
                await this._adminRepository.update(_id, { password: hash })
                break;

            case Role.MECHANIC:
                await this._mechnaicRepository.update(_id, { password: hash })
                break;
            default:
                throw new ApiError('User Not found')
        }

    }

    async changePassword(userId: Types.ObjectId, currentPassword: string, newPassword: string, role: Role): Promise<void> {

        let user: User | Admin | Mechanic | null
        switch (role) {
            case Role.USER:
                user = await this._userRepository.findById(userId)
                break;

            case Role.ADMIN:
                user = await this._adminRepository.findById(userId)
                break;

            case Role.MECHANIC:
                user = await this._mechnaicRepository.findById(userId)
                break;

            default:
                throw new ApiError('User Not found')
        }

        if (!user) throw new ApiError('User Not found')

        const isCurrentPasswordMatch = await this._hashService.compare(currentPassword, user.password);
        if (!isCurrentPasswordMatch) {
            throw new ApiError('Invalid Current Password', HttpStatus.BAD_REQUEST);
        }

        const isCurrentMatchNew = await this._hashService.compare(newPassword, user.password)
        if (isCurrentMatchNew) throw new ApiError('Current password is same as new password', HttpStatus.BAD_REQUEST);

        await this.updatePassword(user.email, newPassword, role, userId)

    }


}

export default ResetPassword