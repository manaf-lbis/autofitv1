import { Types } from "mongoose";
import { PretripSlotDocument, PretripSlotModel } from "../models/pretripSlotModel";
import { BaseRepository } from "./baseRepository";
import { IPretripSlotRepository } from "./interfaces/IPretripSlotRepository";


export class PretripSlotRepository extends BaseRepository<PretripSlotDocument> implements IPretripSlotRepository {

    constructor() {
        super(PretripSlotModel);
    }

    async getSlots(mechanicId: Types.ObjectId, startingDate: Date, endingDate: Date): Promise<PretripSlotDocument[]> {

        return await PretripSlotModel.find({
            mechanicId,
            date: {
                $gte: startingDate,
                $lt: endingDate,
            },
        }).populate('userId', 'name')

    }



}