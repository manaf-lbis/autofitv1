import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { IPretripService } from "../../services/pretripCheckup/interface/IPretripService";
import { ApiError } from "../../utils/apiError";
import { IProfileService } from "../../services/mechanic/interface/IProfileService";



export class PretripController {
    constructor(
        private _pretripService : IPretripService,
        private _mechnanicProfileService : IProfileService
    ) { }


    async weeklySchedules (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            if(!mechanicId) throw new ApiError('Invalid User')
            const result = await this._pretripService.weeklySchedules(mechanicId)
            
            sendSuccess(res, 'Success',result);
        } catch (err) {
            next(err);
        }
    }

    





}

