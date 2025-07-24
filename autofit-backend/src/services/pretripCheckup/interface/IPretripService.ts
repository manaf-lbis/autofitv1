import { Types } from "mongoose";


export interface IPretripService {
    getSlotWihtMechId(mechanicId:Types.ObjectId): Promise<any>
    createSlot(dates: { date: string }[],mechanicId:Types.ObjectId): Promise<any>
    removeSlot(slotId:Types.ObjectId): Promise<any>
    getNearbyMechanicsWithSlot(coord: { lat: number; lng: number }): Promise<any>
}