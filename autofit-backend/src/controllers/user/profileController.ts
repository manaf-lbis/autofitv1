import { Request, Response, NextFunction } from "express";
import { profileValidation } from "../../validation/authValidation";
import { UserProfileService } from "../../services/user/userProfileService";
import { ApiError } from "../../utils/apiError";
import { sendSuccess } from "../../utils/apiResponse";
import { HttpStatus } from "../../types/responseCode";

export class ProfileController {

    constructor (
        private _profileService : UserProfileService

    ) {}


    async updateUser(req: Request, res: Response, next: NextFunction) {
         try {
            
            if(!req.body) throw new ApiError('Invalid Field',HttpStatus.BAD_REQUEST)
            profileValidation.parse(req.body)

            const userId = req.user?.id 
            if(!userId) throw new ApiError("Invalid User",HttpStatus.UNAUTHORIZED)

            const user =  await this._profileService.updateUser({...req.body,userId})
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
            const serviceHistory = await this._profileService.serviceHistoryByUserId(userId)
            sendSuccess(res, 'Profile Updated',serviceHistory);
        } catch (error: any) {
            next(error);
        }
    }

}


