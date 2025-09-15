import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { mechanicRegisterValidation } from "../../validation/mechanicValidation";
import { HttpStatus } from "../../types/responseCode";
import { IProfileService } from "../../services/mechanic/interface/IProfileService";


interface CloudinaryFile extends Express.Multer.File {
    public_id: string;
}

export class ProfileController {
    constructor(
        private _mechanicProfileService: IProfileService,
    ) { }

    async profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user?.id
            if (!id) throw new ApiError('Invalid User');

            const result = await this._mechanicProfileService.getProfile(id);
            sendSuccess(res, 'Successfully Fetched', result);
        } catch (error: any) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const files = req.files as Record<string, CloudinaryFile[]>;
            const photo = files.photo?.[0];
            const shopImage = files.shopImage?.[0];
            const qualification = files.qualification?.[0];
            if (!photo || !shopImage || !qualification) {
                throw new ApiError('All files are required', HttpStatus.BAD_REQUEST);
            }

            const mechanicId = req.user?.id;
            if (!mechanicId) throw new ApiError('Unauthorized', HttpStatus.UNAUTHORIZED);

            const validated = mechanicRegisterValidation.parse(req.body);
            const { education, specialised, experience, shopName, place, landmark, location } = validated;

            await this._mechanicProfileService.registerUser({
                data: { education, specialised, experience, shopName, place, landmark, location },
                photo,
                shopImage,
                qualification,
                mechanicId,
            });

            sendSuccess(res, 'Submitted Successfully');
        } catch (err) {
            next(err);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id;
            if (!mechanicId) throw new ApiError('Unauthorized', HttpStatus.UNAUTHORIZED);

            const validated = mechanicRegisterValidation.parse(req.body);

            await this._mechanicProfileService.updateUser(mechanicId, validated);

            sendSuccess(res, 'Profile Updated Successfully');
        } catch (err) {
            next(err);
        }
    }


    async removeApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id;
            if (!mechanicId) throw new ApiError('Invalid User')

            await this._mechanicProfileService.deleteApplication(mechanicId)
            sendSuccess(res, 'Request Approved');

        } catch (err) {
            next(err);
        }
    }

    async changeAvailablity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id;
            if (!mechanicId) throw new ApiError('Invalid User')

            const availability = req.body.availability
            const response = await this._mechanicProfileService.setAvailablity(mechanicId, { availability })
            sendSuccess(res, 'Success', { availability: response?.availability });

        } catch (err) {
            next(err);
        }
    }

    async setReadNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id
            if (!userId) throw new ApiError('Invalid User')
            await this._mechanicProfileService.setNotificationRead(userId)


            sendSuccess(res, 'Success');
        } catch (err) {
            next(err);
        }
    }

    async getWorkingHours(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            if (!mechanicId) throw new ApiError('Invalid User')
            const result = await this._mechanicProfileService.getWorkingHours(mechanicId)
            sendSuccess(res, 'Success', result);
        } catch (err) {
            next(err);
        }
    }

    async createWorkingHours(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            if (!mechanicId) throw new ApiError('Invalid User')
            const data = req.body
            await this._mechanicProfileService.createWorkingHours(mechanicId, data)
            sendSuccess(res, 'Success');
        } catch (err) {
            next(err);
        }
    }

    async updateworkingHours(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            if (!mechanicId) throw new ApiError('Invalid User')
            const data = req.body
            await this._mechanicProfileService.updateWorkingHours(mechanicId, data)
            sendSuccess(res, 'Success');
        } catch (err) {
            next(err);
        }
    }


    async blockSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            if (!mechanicId) throw new ApiError('Invalid User')

            const { date, isFullDayBlock, blockedTiming, reason } = req.body;

            if (!date) throw new ApiError('Date is required');

            if (isFullDayBlock) {
                if (blockedTiming) throw new ApiError('Blocked timing should not be provided for full day block');
            } else {
                if (!blockedTiming) throw new ApiError('Blocked timing is required for partial block');
            }

            const result = await this._mechanicProfileService.blockSchedule(mechanicId, { date, isFullDayBlock, blockedTiming, reason })

            sendSuccess(res, 'Success', result);
        } catch (err) {
            next(err);
        }
    }

    async unblockSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            if (!mechanicId) throw new ApiError('Invalid User')
            const id = req.body.id
            const result = await this._mechanicProfileService.unblockSchedule(mechanicId, id)
            sendSuccess(res, 'Success', result);
        } catch (err) {
            next(err);
        }
    }








}

