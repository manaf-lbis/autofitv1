import { NextFunction, Request, Response } from "express";
import { IPretripPlanService } from "../../services/pretripCheckup/interface/IPretripPlanService";
import { sendSuccess } from "../../utils/apiResponse";

export class PretripController {

    constructor(
        private _pretripPlanService: IPretripPlanService
    ){};

    async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await this._pretripPlanService.plansWithFeatureNames();
            sendSuccess(res, 'Plans fetched successfully', plans);

        } catch (error) {
            next(error)
        }
    }


}