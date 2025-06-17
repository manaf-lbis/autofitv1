import { Request, Response, NextFunction } from "express";
import { profileValidation } from "../../validation/authValidation";
import { ProfileService } from "../../services/user/userProfileService";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { string } from "zod";
import { sendSuccess } from "../../utils/apiResponse";


export class ProfileController {

    constructor (
        private profileService : ProfileService

    ) {}


    async updateUser(req: Request, res: Response, next: NextFunction) {
         try {
            
            if(!req.body) throw new ApiError('Invalid Field',400)
            profileValidation.parse(req.body)

            const userId = req.user?.id 
            if(!userId) throw new ApiError("Invalid User",400)

            const user =  await this.profileService.updateUser({...req.body,userId})
            if(!user) throw new ApiError('Invalid User')
            const {name,email,mobile} = user

            sendSuccess(res, 'Profile Updated', {name,email,mobile});

        } catch (error: any) {
            next(error);
        }
    }

    async serviceHistory(req: Request, res: Response, next: NextFunction) {
         try {
            const userId = req.user?.id
            if(!userId) throw new ApiError('Invalid user')
            const serviceHistory = await this.profileService.serviceHistoryByUserId(userId)
            sendSuccess(res, 'Profile Updated',serviceHistory);
        } catch (error: any) {
            next(error);
        }
    }

}


