import { NextFunction, Request, Response } from "express";
import { MechanicService } from "../../services/admin/mechanicSevice";
import { MechanicDocument } from "../../models/mechanicModel";
import { sendSuccess } from "../../utils/apiResponse";
import { Types } from "mongoose";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { ProfileService } from "../../services/mechanic/profileService";
import { ApiError } from "../../utils/apiError";


export class MechanicController {
    constructor(
        private mechanicService: MechanicService,
        private mechanicProfileService : ProfileService


    ) { }

    async getAllMechanic(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = '1', limit = '10', search, sortField = 'createdAt', sortOrder = 'desc' } = req.query;

            const result = await this.mechanicService.allUsers({
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
            const result = await this.mechanicService.mechanicDetails({ userId })

            sendSuccess(res, 'Fetched Successfully', result)

        } catch (error) {
            next(error)
        }
    }


    async changeStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const { status } = req.body

            await this.mechanicService.updataUser({ userId, data: { status } })
            sendSuccess(res, 'updated sucessfully')

        } catch (error) {
            next(error)
        }

    }


    async listApplications(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = '1', limit = '10', search, sortField, sortOrder } = req.query;

            const result = await this.mechanicService.mechanicApplications({
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                search: search as string,
                sortField: sortField as keyof MechanicProfileDocument,
                sortOrder: sortOrder as 'asc' | 'desc',
            });

            res.status(200).json({
                status: 'success',
                message: 'Pending applications fetched successfully',
                data: result,
            });

        } catch (err) {
            next(err);
        }
    }


    async getApplication(req: Request, res: Response, next: NextFunction) {

    }


    async applicationStatus(req: Request, res: Response, next: NextFunction) {
        try {

            const { status } = req.body
            const profileId = new Types.ObjectId(req.params.id)

            if(status !== 'approved' && status !== 'rejected') throw new ApiError('Invalid Status')

            await this.mechanicProfileService.changeStatus({profileId,status})
            sendSuccess(res,`Application ${status} `)


        } catch (err) {
            next(err);
        }

    }

}