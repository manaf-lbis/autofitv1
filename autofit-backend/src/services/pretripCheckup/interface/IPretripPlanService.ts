import { Types } from "mongoose";
import { IPretripFeature, IPretripPlan } from "../../../types/pretrip";

export interface IPretripPlanService {
    createFeature(name:string):Promise<IPretripFeature>
    getFeatures():Promise<IPretripFeature[]>
    createPlan(data:Partial<IPretripPlan>):Promise<IPretripPlan>
    getPlans():Promise<IPretripPlan[]>
    updatePlan(id:Types.ObjectId,data:Partial<IPretripPlan>):Promise<IPretripPlan | null>
    deletePlan(id:Types.ObjectId):Promise<void>
    togglePlanStatus(id:Types.ObjectId):Promise<void>
    updateFeature(id:Types.ObjectId,name:string):Promise<IPretripFeature | null>
    deleteFeature(id:Types.ObjectId):Promise<void>
}