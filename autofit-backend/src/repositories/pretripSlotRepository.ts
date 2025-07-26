import { Types } from "mongoose";
import { PretripSlotDocument, PretripSlotModel } from "../models/pretripSlotModel";
import { BaseRepository } from "./baseRepository";
import { IPretripSlotRepository } from "./interfaces/IPretripSlotRepository";
import { SlotStatus } from "../types/pretrip";


export class PretripSlotRepository extends BaseRepository<PretripSlotDocument> implements IPretripSlotRepository {

    constructor() {
        super(PretripSlotModel);
    }

    async getSlots(mechanicId: Types.ObjectId, startingDate: Date, endingDate: Date, availableOnly: boolean): Promise<PretripSlotDocument[]> {

        const config: any = {
            mechanicId,
            date: {
                $gte: startingDate,
                $lt: endingDate,
            },
        }

        if (availableOnly) config.status = { $ne: [SlotStatus.BOOKED, SlotStatus.BLOCKED] }

        return await PretripSlotModel.find({
            mechanicId,
            date: {
                $gte: startingDate,
                $lt: endingDate,
            },
        }).populate('userId', 'name').populate('vehicleId','regNo brand modelName')

    }

    async cleanupExpiredSlots(): Promise<any> {

        await PretripSlotModel.deleteMany({
            status: 'available',
            date: { $lt: new Date(new Date().setHours(0, 0, 0, 0)) },
        });

        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        await PretripSlotModel.updateMany(
            {
                status: { $ne: 'booked' },
                updatedAt: { $lt: thirtyMinutesAgo }
            },
            {
                $set: { status: 'available' },
                $unset: {
                    bookingId: "",
                    servicePlan: "",
                    userId: "",
                    vehicleId: ""
                }
            }
        );

    }



}