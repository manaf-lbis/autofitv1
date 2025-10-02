import { Request, Response, NextFunction } from "express";
import { profileValidation } from "../../validation/authValidation";
import { ApiError } from "../../utils/apiError";
import { sendSuccess } from "../../utils/apiResponse";
import { HttpStatus } from "../../types/responseCode";
import { IUserProfileService } from "../../services/user/Interface/IUserProfileService";
import { ServiceType } from "../../types/services";
import { Types } from "mongoose";
import { Sort } from "../../types/rating";

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

    async addReview(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body) throw new ApiError('Invalid Field', HttpStatus.BAD_REQUEST)

            const { serviceType, review, rating, serviceId } = req.body

            const userId = req.user?.id
            if (!userId) throw new ApiError("Invalid User", HttpStatus.UNAUTHORIZED)
            if (!Object.values(ServiceType).includes(serviceType)) throw new ApiError('Invalid Service Type', HttpStatus.BAD_REQUEST);
            if (isNaN(Number(rating))) throw new ApiError('Invalid Rating', HttpStatus.BAD_REQUEST)
            if (rating < 1 || rating > 5) throw new ApiError('Invalid Rating', HttpStatus.BAD_REQUEST);
            if (!serviceId) throw new ApiError('Invalid Service Id', HttpStatus.BAD_REQUEST);

            await this._profileService.addReview(userId, review?.trim(), rating, serviceId, serviceType)

            sendSuccess(res, 'Review added');
        } catch (error: any) {
            next(error);
        }
    }

    async listReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, mechanic, sort } = req.query

            if (!page || isNaN(Number(page)) || Number(page) < 1) throw new ApiError('Invalid page number', HttpStatus.BAD_REQUEST)
            if (!mechanic) throw new ApiError('Invalid user')
            if (!Types.ObjectId.isValid(String(mechanic))) throw new ApiError('Invalid mechanic', HttpStatus.BAD_REQUEST)
            if (!Object.values(Sort).includes(String(sort) as Sort)) throw new ApiError('Invalid sort', HttpStatus.BAD_REQUEST)

            const reviews = await this._profileService.listReviews(new Types.ObjectId(String(mechanic)), Number(page),sort as Sort);
            sendSuccess(res, 'Reviews', reviews);
        } catch (error: any) {
            next(error);
        }
    }


}


