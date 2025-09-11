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


    async findBlockingByDateRange(mechanicId: Types.ObjectId, start: Date, end: Date, type: BlockType): Promise<TimeBlockDocument[]> {
        const searchParameter: any = {
            mechanicId,
            date: { $gte: start, $lte: end }
        }
        if (type) searchParameter.blockType = type
        return await TimeBlockModel.find(searchParameter)
    }

    async checkIsBlocked(mechanicId: Types.ObjectId[], startMinutes: number, endMinutes: number, date: Date = new Date()): Promise<any> {
        return await TimeBlockModel.find({
            mechanicId: { $in: mechanicId },
            date: {
                $gte: new Date(date.setHours(0, 0, 0, 0)),
                $lt: new Date(date.setHours(23, 59, 59, 999))
            },
            startMinutes: { $lt: endMinutes },
            endMinutes: { $gt: startMinutes }
        }).distinct("mechanicId");

    }

    async timeBlockByTimeRange(mechanicId: Types.ObjectId, startMinutes: number, endMinutes: number, date?: Date): Promise<TimeBlockDocument | null> {
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        return await TimeBlockModel.findOne({
            mechanicId,
            date: targetDate,
            startMinutes: { $lt: endMinutes }, endMinutes: { $gt: startMinutes }
        });
    }

    async slotCleanup() {
        const PAYMENT_BUFFER = Number(process.env.PAYMENT_BUFFER) * 60 * 1000;
        const cutoff = new Date(Date.now() - PAYMENT_BUFFER);
        return await TimeBlockModel.deleteMany({
            blockType: BlockType.PAYMENT_DELAY,
            createdAt: { $lte: cutoff } 
        });
    }


}