import { NextFunction, Request, Response } from "express";
import { MechanicService } from "../../services/admin/mechanicSevice";
import { MechanicDocument } from "../../models/mechanicModel";
import { sendSuccess } from "../../utils/apiResponse";
import { Types } from "mongoose";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { ProfileService } from "../../services/mechanic/profileService";
import { ApiError } from "../../utils/apiError";
import { getIO, userSocketMap } from "../../sockets/socket";  
import { HttpStatus } from "../../types/responseCode";


export class MechanicController {
    constructor(
        private _mechanicService: MechanicService,
        private _mechanicProfileService : ProfileService


    ) { }

    async getAllMechanic(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = '1', limit = '10', search, sortField = 'createdAt', sortOrder = 'desc' } = req.query;

            const result = await this._mechanicService.allUsers({
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                search: search as string,
                sortField: sortField as keyof MechanicDocument,
                sortOrder: sortOrder as 'asc' | 'desc',
            });
            sendSuccess(res, 'Users List', result)

        } catch (error) {
            next(error)
        }

    }


    async getMechanicById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const result = await this._mechanicService.mechanicDetails({ userId })

            sendSuccess(res, 'Fetched Successfully', result)

        } catch (error) {
            next(error)
        }
    }


    async changeStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const { status } = req.body

            await this._mechanicService.updataUser({ userId, data: { status } })

            if(status === 'blocked'){
                const userData  = userSocketMap.get(userId.toString())
                if (userData && userData.socketIds.size > 0) {
                    const io = getIO()
                    userData.socketIds.forEach((socketId)=>{
                        io.to(socketId).emit('forceLogout',{message:'Your Accout Hasbeen Blocked.'})
                    })
                }
            }
            
            sendSuccess(res, 'Status Changed') // block or unblock

        } catch (error) {
            next(error)
        }

    }


    async listApplications(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = '1', limit = '10', search, sortField, sortOrder } = req.query;

            const result = await this._mechanicService.mechanicApplications({
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                search: search as string,
                sortField: sortField as keyof MechanicProfileDocument,
                sortOrder: sortOrder as 'asc' | 'desc',
            });

            res.status(HttpStatus.OK).json({
                status: 'success',
                message: 'Pending applications fetched successfully',
                data: result,
            });

        } catch (err) {
            next(err);
        }
    }




    async applicationStatus(req: Request, res: Response, next: NextFunction) {
        try {

            const { status, rejectionReason} = req.body
            const profileId = new Types.ObjectId(req.params.id)

            if(status === 'approved'){
               await this._mechanicProfileService.changeStatus({profileId,status}) 

            }else if(status === 'rejected'){
                await this._mechanicProfileService.changeStatus({profileId,status,rejectionReason}) 
            } else{
                throw new ApiError('Invalid Status')
            }
            
            sendSuccess(res,`Application ${status}`)

        } catch (err) {
            next(err);
        }

    }

}