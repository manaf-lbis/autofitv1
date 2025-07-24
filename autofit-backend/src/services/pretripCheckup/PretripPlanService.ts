import { Types } from "mongoose";
import { IPretripFeatureRepository } from "../../repositories/interfaces/IPretripFeatureRepository";
import { IPretripPlanRepository } from "../../repositories/interfaces/IPretripPlanRepository";
import { IPretripFeature, IPretripPlan } from "../../types/pretrip";
import { IPretripPlanService } from "./interface/IPretripPlanService";
import { ApiError } from "../../utils/apiError";

export class PretripPlanService implements IPretripPlanService {

    constructor(
        private _pretripFeatureRepository : IPretripFeatureRepository,
        private _pretripPlanRepository : IPretripPlanRepository
    ){}

    async createFeature(name: string): Promise<IPretripFeature> {
        return await this._pretripFeatureRepository.save({name});
    };

    async getFeatures(): Promise<IPretripFeature[]> {
        return await this._pretripFeatureRepository.findAll();
    }

    async createPlan(data: Partial<IPretripPlan>): Promise<IPretripPlan> {
        return await this._pretripPlanRepository.save(data);
    }

    async getPlans(): Promise<IPretripPlan[]> {
        return await this._pretripPlanRepository.findWithFilters({isDeleted: false});
    }

    async updatePlan(id: Types.ObjectId, data: Partial<IPretripPlan>): Promise<IPretripPlan | null> {
        const isExist = await this._pretripPlanRepository.findById(id)
        if(!isExist) throw new ApiError("Plan not found");
        return await this._pretripPlanRepository.update(id, data);
    }

    async deletePlan(id: Types.ObjectId): Promise<void> {
        const isExist = await this._pretripPlanRepository.findById(id)
        if(!isExist) throw new ApiError("Plan not found");
        await this._pretripPlanRepository.update(id, {isDeleted: true});
    }

   async togglePlanStatus(id: Types.ObjectId): Promise<void> {
        const isExist = await this._pretripPlanRepository.findById(id)
        if(!isExist) throw new ApiError("Plan not found");
        await this._pretripPlanRepository.update(id, {isActive: !isExist.isActive});
    }

    async updateFeature(id: Types.ObjectId, name: string): Promise<IPretripFeature | null> {
        const isExist = await this._pretripFeatureRepository.findById(id)
        if(!isExist) throw new ApiError("Feature not found");
        return await this._pretripFeatureRepository.update(id, {name});
    }

    async deleteFeature(id: Types.ObjectId): Promise<void> {
        const isExist = await this._pretripFeatureRepository.findById(id)
        if(!isExist) throw new ApiError("Feature not found");
        await this._pretripFeatureRepository.delete(id);
    }

    async plansWithFeatureNames(): Promise<IPretripPlan[] | void[]> {
        return await this._pretripPlanRepository.plansWithFeatures()
    }

    async getPlan(id: Types.ObjectId): Promise<IPretripPlan | null> {
        return await this._pretripPlanRepository.findPlanDetails(id)
    }

    

}