import { FilterQuery, Types } from "mongoose";
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


    async plansWithFeatures(): Promise<any> {

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

    async findPlanDetails(id: Types.ObjectId): Promise<any> {
        const plan = await PretripPlanModel.findById(id)
            .populate('features', 'name -_id')
            .select('-__v')
            .lean()
            .exec();
            
        const featureNames = (plan?.features || []).map((f: any) => f.name);

        return {
            ...plan,
            features: featureNames,
        };
    }
}