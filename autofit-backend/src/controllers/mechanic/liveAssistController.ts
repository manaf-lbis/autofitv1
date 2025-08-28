import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { ILiveAssistanceService } from "../../services/liveAssistanceService/ILiveAssistanceService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";

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

    async serviceHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            const {page} = req.query
            if(!page || isNaN(Number(page))) throw new ApiError('Invalid page number',HttpStatus.BAD_REQUEST)
            if(!mechanicId) throw new ApiError('Invalid user')
                
            const serviceHistory = await this._liveAssistanceService.serviceHistory(mechanicId,Number(page))
            sendSuccess(res, 'Success', serviceHistory);

        } catch (err) {
            next(err);
        }
    }
}