import { IBaseRepository } from "./IBaseRepository";
import { PretripSlotDocument } from "../../models/pretripSlotModel";
import { Types } from "mongoose";

export interface IPretripSlotRepository extends IBaseRepository<PretripSlotDocument> {
    getSlots(mechanicId: Types.ObjectId,startingDate: Date, endingDate: Date, availableOnly?: boolean): Promise<PretripSlotDocument[]>
    cleanupExpiredSlots(): Promise<any>
}