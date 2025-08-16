import { Types } from "mongoose";
import { WorkingHoursDocument } from "../../models/workingHoursModel";
import { IBaseRepository } from "./IBaseRepository";

export interface CheckAvailablityParams {
    mechanicId : Types.ObjectId
    day: string
    startingMinute: number
    endingMinute: number
}

export interface IWorkingHoursRepository extends IBaseRepository<WorkingHoursDocument> {
    getWorkingHours(mechanicId: Types.ObjectId): Promise<any>;
    updateWorkingHours(mechanicId: Types.ObjectId, workingHours: any): Promise<any>;
    workingHoursOfMultipleMechanics(mechanicIds: Types.ObjectId[]): Promise<any>;
    checkAvailablity({ mechanicId, day, startingMinute, endingMinute}:CheckAvailablityParams):Promise<any>
}