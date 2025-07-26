import { Types } from "mongoose";


export interface IPretripService {
    getSlotWihtMechId(mechanicId:Types.ObjectId, availableOnly?: boolean): Promise<any>
    createSlot(dates: { date: string }[],mechanicId:Types.ObjectId): Promise<any>
    removeSlot(slotId:Types.ObjectId): Promise<any>
    getNearbyMechanicsWithSlot(coord: { lat: number; lng: number }): Promise<any>
    createBooking({coords,mechanicId,planId,slotId,vehicleId,userId}:
    {userId: Types.ObjectId, planId: Types.ObjectId, mechanicId: Types.ObjectId, vehicleId: Types.ObjectId, slotId: Types.ObjectId, coords: { lat: number; lng: number }}): Promise<any>

}