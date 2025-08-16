import { PretripPlanDocument } from "../../models/pretripPlanModel";
import { IBaseRepository } from "./IBaseRepository";
import { FilterQuery, Types } from 'mongoose';

export interface IPretripPlanRepository extends IBaseRepository<PretripPlanDocument>{
    findWithFilters(query: FilterQuery<PretripPlanDocument>): Promise<PretripPlanDocument[]>
    plansWithFeatures(): Promise<any>
    findPlanDetails(id:Types.ObjectId): Promise<any>
}