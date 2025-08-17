import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { ILiveAssistanceService } from "../../services/liveAssistanceService/ILiveAssistanceService";
import { ApiError } from "../../utils/apiError";

export class LiveAssistanceController {
    constructor(
        private _liveAssistanceService : ILiveAssistanceService
    ){}

    async getDetails(req:Request,res:Response,next:NextFunction){
        try {
            const mechanicId = req.user?.id
            if(!mechanicId) throw new ApiError('Invalid user')
            const response = await this._liveAssistanceService.activeBookingsByMechanicId(mechanicId);
        
            sendSuccess(res,'Details fetched successfully',response)
        } catch (error) {
            next(error)
        }

    }
}