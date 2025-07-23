import { PretripPlanDocument } from "../../models/pretripPlanModel";
import { IBaseRepository } from "./IBaseRepository";
import { FilterQuery } from 'mongoose';

export interface IPretripPlanRepository extends IBaseRepository<PretripPlanDocument>{
    findWithFilters(query: FilterQuery<PretripPlanDocument>): Promise<PretripPlanDocument[]>
    planWithFeatures(): Promise<any>
}