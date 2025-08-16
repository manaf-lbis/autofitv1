import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { IPretripPlanService } from "../../services/pretripCheckup/interface/IPretripPlanService";
import { sendSuccess } from "../../utils/apiResponse";
import { Types } from "mongoose";



export class PretripController {

    constructor(
        private _pretripPlanService: IPretripPlanService
    ) { }

    async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await this._pretripPlanService.getPlans();
            sendSuccess(res, 'Plans fetched successfully', plans)
        } catch (error) {
            next(error)
        }

    }

    async createPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, price, originalPrice, features, isPopular } = req.body
            if (!name.trim() || !description.trim() || price <= 0 || originalPrice < price || !features.length || isPopular === undefined) throw new ApiError('Invalid Fields', HttpStatus.BAD_REQUEST);
            const plan = await this._pretripPlanService.createPlan({ name, description, price, originalPrice, features, isPopular });
            sendSuccess(res, 'Plan created successfully', plan)

        } catch (error) {
            next(error)
        }


    }

    async updatePlan(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description, price, originalPrice, features, isPopular,duration } = req.body;
            if (duration <=0 || !name.trim() || !description.trim() || price <= 0 || originalPrice < price || !features.length || isPopular === undefined ){
               throw new ApiError('Invalid Fields', HttpStatus.BAD_REQUEST); 
            } 
            
            if(!req.params.id) throw new ApiError('Plan id is required', HttpStatus.BAD_REQUEST);
            
            const planId = new Types.ObjectId(req.params.id)
            const plan = await this._pretripPlanService.updatePlan(planId, { name, description, price, originalPrice, features, isPopular ,duration});

            sendSuccess(res, 'Plan updated successfully',plan)
        } catch (error) {
            next(error)

        }

    }

    async deletePlan(req: Request, res: Response, next: NextFunction) {
        try {
            if(req.params.id === undefined) throw new ApiError('Plan id is required', HttpStatus.BAD_REQUEST);
            const id = new Types.ObjectId(req.params.id);

            await this._pretripPlanService.deletePlan(id);
            sendSuccess(res,'Plan Deleted Successfully')
        } catch (error) {
            next(error)

        }
    }

    async getFeatures(req: Request, res: Response, next: NextFunction) {
        try {
            const features = await this._pretripPlanService.getFeatures();
            sendSuccess(res, 'Features fetched successfully', features)

        } catch (error) {
            next(error)

        }

    }

    async createFeature(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.body?.name.trim()
            if (!name) throw new ApiError('Feature name is required', HttpStatus.BAD_REQUEST);
            const feature = await this._pretripPlanService.createFeature(name);
            sendSuccess(res, 'Feature created successfully', feature)
        } catch (error) {
            next(error)
        }
    }

    async updateFeature(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if(!id) throw new ApiError('Feature id is required', HttpStatus.BAD_REQUEST);
            const featureId = new Types.ObjectId(id)
            const name = req.body?.name.trim()

            if (!name) throw new ApiError('Feature name is required', HttpStatus.BAD_REQUEST);
            const feature = await this._pretripPlanService.updateFeature(featureId, name);
            sendSuccess(res, 'Feature updated successfully', feature)

        } catch (error) {
            next(error)

        }
    }

    async deleteFeature(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if(!id) throw new ApiError('Feature id is required', HttpStatus.BAD_REQUEST);
            const featureId = new Types.ObjectId(id)
            await this._pretripPlanService.deleteFeature(featureId);
            sendSuccess(res, 'Feature deleted successfully')

        } catch (error) {
            next(error)

        }
    }

    async togglePlanStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if(!id) throw new ApiError('Invalid Parameter');
            const planId = new Types.ObjectId(id)
            await this._pretripPlanService.togglePlanStatus(planId);
            sendSuccess(res, 'Plan status updated successfully')

        } catch (error) {
            next(error)

        }
    }
}