import { Request, Response, NextFunction } from "express";
import { UserServices } from "../../services/admin/userServices";
import { User } from "../../types/user/user";
import { sendSuccess } from "../../utils/apiResponse";
import { Types } from "mongoose";
import { getIO, userSocketMap } from "../../sockets/socket";



export class UserController {
    constructor(
        private _userServices: UserServices
    ) {}


    async getAllUsers(req: Request, res: Response, next: NextFunction) {

        try {
            const { page = '1', limit = '10', search, sortField = 'createdAt', sortOrder = 'desc' } = req.query;

            const result = await this._userServices.allUsers({
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                search: search as string,
                sortField: sortField as keyof User,
                sortOrder: sortOrder as 'asc' | 'desc',
            });
            sendSuccess(res, 'Users List', result)

        } catch (error) {
            next(error)
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const result = await this._userServices.userDetails({ userId })

            sendSuccess(res, 'Fetched Successfully', result)

        } catch (error) {
            next(error)
        }
    }

    async changeStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const { status } = req.body

            await this._userServices.updataUser({ userId, data: { status } })

            if (status === 'blocked') {
                const userData = userSocketMap.get(userId.toString())
                if (userData && userData.socketIds.size > 0) {
                    const io = getIO()
                    userData.socketIds.forEach((socketId) => {
                        io.to(socketId).emit('forceLogout', { message: 'Your Accout Hasbeen Blocked.' })
                    })
                }
            }

            sendSuccess(res, 'updated sucessfully')

        } catch (error) {
            next(error)
        }

    }


}