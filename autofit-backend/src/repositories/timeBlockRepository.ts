import { endOfDay, startOfDay } from "date-fns";
import { BlockType, TimeBlockDocument, TimeBlockModel } from "../models/timeBlock";
import { BaseRepository } from "./baseRepository";
import { ITimeBlockRepository } from "./interfaces/ITimeBlockRepository";
import { Types } from "mongoose";

export class TimeBlockRepository extends BaseRepository<TimeBlockDocument> implements ITimeBlockRepository {
    constructor() {
        super(TimeBlockModel)
    }

    async getBlockingByDate(mechanicId: Types.ObjectId, date: Date): Promise<TimeBlockDocument[]> {
        const start = startOfDay(date);
        const end = endOfDay(date);
        return await TimeBlockModel.find({ mechanicId, date: { $gte: start, $lte: end } })
    };

    async findOverlappingBlocks(mechanicId: Types.ObjectId, date: Date, startMinutes: number, endMinutes: number): Promise<TimeBlockDocument[]> {
        return await TimeBlockModel.find({ mechanicId, date, startMinutes: { $lt: endMinutes }, endMinutes: { $gt: startMinutes } }); 
    }


    async findBlockingByDateRange(mechanicId: Types.ObjectId, start: Date, end: Date ,type: BlockType): Promise<TimeBlockDocument[]> {
        const searchParameter:any = {
            mechanicId,
            date: { $gte: start, $lte: end }
        }
        if(type) searchParameter.blockType = type
        return await TimeBlockModel.find(searchParameter)
    }

    
}