import { IBaseRepository } from "./IBaseRepository";
import {BlockType, TimeBlockDocument} from "../../models/timeBlock"
import { Types } from "mongoose";

export interface ITimeBlockRepository extends IBaseRepository<TimeBlockDocument>{
    getBlockingByDate(mechanicId: Types.ObjectId, date:Date):Promise<TimeBlockDocument[]>
    findOverlappingBlocks(mechanicId: Types.ObjectId,date:Date, startMinutes: number, endMinutes: number): Promise<TimeBlockDocument[]>
    findBlockingByDateRange(mechanicId: Types.ObjectId, start:Date, end:Date ,type?:BlockType):Promise<TimeBlockDocument[]>
}