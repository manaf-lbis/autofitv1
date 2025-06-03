import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { ProfileService } from "../../services/mechanic/profileService";
import { mechanicRegisterValidation } from "../../validation/mechanicValidation";


export class ProfileController {
    constructor(
        private mechanicProfileService: ProfileService
    ) { }

    async profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user?.id
            if (!id) throw new ApiError('Invalid User');

            const result = await this.mechanicProfileService.getProfile(id);
            sendSuccess(res, 'Successfully Fetched', result);
        } catch (error: any) {
            next(error);
        }
    }


    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = req.files as Record<string, Express.Multer.File[]>;
            const photo = files.photo?.[0];
            const shopImage = files.shopImage?.[0];
            const qualification = files.qualification?.[0];
            if (!photo || !shopImage || !qualification) {
                throw new ApiError('All files are required', 400);
            }

            const mechanicId = req.user?.id;
            if (!mechanicId) throw new ApiError('Unauthorized', 401);

            const validated = mechanicRegisterValidation.parse(req.body);
            const { education, specialised, experience, shopName, place, landmark, location } = validated;

            await this.mechanicProfileService.registerUser({
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


     async removeApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id;
            if(!mechanicId) throw new ApiError('Invalid User') 

            await this.mechanicProfileService.deleteApplication(mechanicId)
            sendSuccess(res,'Request Approved');

        } catch (err) {
            next(err);
        }
    }

}

