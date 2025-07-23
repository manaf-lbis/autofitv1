import { FilterQuery } from "mongoose";
import { PretripPlanModel, PretripPlanDocument } from "../models/pretripPlanModel";
import { BaseRepository } from "./baseRepository";
import { IPretripPlanRepository } from "./interfaces/IPretripPlanRepository";

export class PretripPlanRepository extends BaseRepository<PretripPlanDocument> implements IPretripPlanRepository {
    constructor() {
        super(PretripPlanModel);
    }

    async findWithFilters(query: FilterQuery<PretripPlanDocument>): Promise<PretripPlanDocument[]> {
        return await PretripPlanModel.find(query).select('-__v').exec();
    }


    async planWithFeatures(): Promise<any> {

        const plans = await PretripPlanModel.find().populate('features', 'name -_id').select('-__v').exec();
        const cleanedPlan = plans.map((plan) => {
            return {
                ...plan.toObject(),
                features: plan.features.map((feature: any) => {
                    return feature.name
                })
            }
        })
        return cleanedPlan
    }
}