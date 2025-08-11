import { NextFunction, Request, Response } from "express";
import { IPretripPlanService } from "../../services/pretripCheckup/interface/IPretripPlanService";
import { sendSuccess } from "../../utils/apiResponse";
import { Types } from "mongoose";
import { IPretripService } from "../../services/pretripCheckup/interface/IPretripService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";

export class PretripController {

    constructor(
        private _pretripPlanService: IPretripPlanService,
        private _pretripService: IPretripService
    ) { };

    async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await this._pretripPlanService.plansWithFeatureNames();
            sendSuccess(res, 'Plans fetched successfully', plans);

        } catch (error) {
            next(error)
        }
    }

    async getPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await this._pretripPlanService.getPlan(new Types.ObjectId(req.params.id));
            sendSuccess(res, 'Plan fetched successfully', plan);
        } catch (error) {
            next(error)
        }
    }

    async getNearbyMechanics(req: Request, res: Response, next: NextFunction) {
        try {
            const { lat, lng } = req.query;
            if (!lat || !lng) throw new ApiError('Invalid Request Body', HttpStatus.BAD_REQUEST);

           const mechanics = await this._pretripService.getNearbyMechanics({ lat: parseFloat(lat as string), lng: parseFloat(lng as string) });
            
            sendSuccess(res, 'Mechanics fetched successfully', mechanics);
        } catch (error) {
            next(error)
        }
    }

    async booking(req: Request, res: Response, next: NextFunction) {
        try {
            const { planId, mechanicId, vehicleId, slot, coords } = req.body;
            const userId = req.user?.id;

            if (!planId || !mechanicId || !vehicleId || !slot || !coords || !userId) throw new ApiError('Invalid Request Body', HttpStatus.BAD_REQUEST);

            const booking = await this._pretripService.createBooking({
                planId,
                mechanicId,
                vehicleId,
                slot,
                coords,
                userId
            });

            sendSuccess(res, 'Complete Payment withing 20 Minutes', booking);
            
        } catch (error) {
            next(error)
        }
    }


}