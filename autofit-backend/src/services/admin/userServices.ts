import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { User } from "../../types/user/user";
import { IVehicleRepository } from "../../repositories/interfaces/IVehicleRepository";
import { IUserService } from "./interface/IUserServices";
import { UserMapper } from "../../dtos/userDto";



export class UserServices implements IUserService {
    constructor(
        private _userRepository: IUserRepository,
        private _vehicleRepository: IVehicleRepository
    ) { }

    async allUsers(data: { page: number; limit: number; search?: string; sortField?: keyof User; sortOrder?: "asc" | "desc"; }) {
        const result = await this._userRepository.findUsersWithPagination(data)
        return {
            users: result.users.map((user)=> UserMapper.toAdminResponse(user)),
            total: result.total,
            page: result.page,
            totalPages: result.totalPages
        }
    }

    async updataUser({ userId, data }: { userId: Types.ObjectId, data: Partial<User> }) {
        await this._userRepository.update(userId, data)
    }

    async userDetails({ userId }: { userId: Types.ObjectId }) {

        const [vehicles, user] = await Promise.all([
            this._vehicleRepository.findWithUserId(userId),
            this._userRepository.findById(userId)
        ]);

        if (!user || !vehicles) throw new ApiError('Invalid User');

        const { email, mobile, name, status, createdAt, _id } = user

        return { userData: { email, mobile, name, status, createdAt, _id }, vehicles };
    }

}