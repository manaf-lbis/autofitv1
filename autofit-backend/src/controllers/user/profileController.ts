import { Request, Response, NextFunction } from "express";
import { profileValidation } from "../../validation/authValidation";
import { ApiError } from "../../utils/apiError";
import { sendSuccess } from "../../utils/apiResponse";
import { HttpStatus } from "../../types/responseCode";
import { IUserProfileService } from "../../services/user/Interface/IUserProfileService";

export class ProfileController {

    constructor(
        private _profileService: IUserProfileService
    ) { }


    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {

            if (!req.body) throw new ApiError('Invalid Field', HttpStatus.BAD_REQUEST)
            profileValidation.parse(req.body)

            const userId = req.user?.id
            if (!userId) throw new ApiError("Invalid User", HttpStatus.UNAUTHORIZED)

            const user = await this._profileService.updateUser({ ...req.body, userId })
            if (!user) throw new ApiError('Invalid User')
            const { name, email, mobile } = user

            sendSuccess(res, 'Profile Updated', { name, email, mobile });

        } catch (error: any) {
            next(error);
        }
    }

    async roadsideServiceHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const { page } = req.query
            if (!page || isNaN(Number(page))) throw new ApiError('Invalid page number', HttpStatus.BAD_REQUEST)
            if (!userId) throw new ApiError('Invalid user')

            const serviceHistory = await this._profileService.roadsideServiceHistory(userId, Number(page));
            sendSuccess(res, 'Service History', serviceHistory);
        } catch (error: any) {
            next(error);
        }
    }

    async pretripServiceHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const { page } = req.query
            if (!page || isNaN(Number(page))) throw new ApiError('Invalid page number', HttpStatus.BAD_REQUEST)
            if (!userId) throw new ApiError('Invalid user')

            const serviceHistory = await this._profileService.pretripServiceHistory(userId, Number(page));
            sendSuccess(res, 'Service History', serviceHistory);
        } catch (error: any) {
            next(error);
        }
    }

    async liveAssistanceServiceHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const { page } = req.query
            if (!page || isNaN(Number(page))) throw new ApiError('Invalid page number', HttpStatus.BAD_REQUEST)
            if (!userId) throw new ApiError('Invalid user')

            const serviceHistory = await this._profileService.liveAssistanceServiceHistory(userId, Number(page));
            sendSuccess(res, 'serviceHistory', serviceHistory);
        } catch (error: any) {
            next(error);
        }
    }


}


