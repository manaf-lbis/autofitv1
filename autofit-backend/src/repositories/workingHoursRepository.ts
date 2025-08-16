import { Types } from "mongoose";
import { WorkingHoursDocument, WorkingHoursModel } from "../models/workingHoursModel";
import { BaseRepository } from "./baseRepository";
import { CheckAvailablityParams, IWorkingHoursRepository } from "./interfaces/IWorkingHoursRepository";
import { DAYS_OF_WEEK } from "../utils/constants";

export class WorkingHoursRepository extends BaseRepository<WorkingHoursDocument> implements IWorkingHoursRepository {

    constructor (){
        super(WorkingHoursModel)
    }
    async getWorkingHours(mechanicId: Types.ObjectId): Promise<any> {
       return await WorkingHoursModel.findOne({mechanicId}).select(`${DAYS_OF_WEEK.split(',').join(' ')}, -_id`).lean()
    }

    async updateWorkingHours(mechanicId: Types.ObjectId, workingHours: any): Promise<any> {
        return await WorkingHoursModel.updateOne({mechanicId},workingHours)
    }

    async workingHoursOfMultipleMechanics(mechanicIds: Types.ObjectId[]): Promise<any> {
        return await WorkingHoursModel.find({mechanicId:{$in:mechanicIds}})
    }

    async checkAvailablity({ mechanicId, day, startingMinute, endingMinute }: CheckAvailablityParams): Promise<any> {
        return await WorkingHoursModel.findOne({ mechanicId, [`${day}.openTime`]: { $lte: startingMinute }, [`${day}.closeTime`]: { $gte: endingMinute } })
    }


    

}