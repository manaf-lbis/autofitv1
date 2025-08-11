import { Types } from "mongoose";

export interface ICreateBookingParams {
    userId: Types.ObjectId,
    planId: Types.ObjectId,
    mechanicId: Types.ObjectId,
    vehicleId: Types.ObjectId,
    slot: {
        date: string,
        time: string
    },
    coords: {
        lat: number;
        lng: number
    }
}


export interface IPretripService {
    createBooking({ coords, mechanicId, planId, slot, vehicleId, userId }:ICreateBookingParams): Promise<any>
    getNearbyMechanics(params: { lat: number; lng: number }): Promise<any>
    weeklySchedules(mechanicId: Types.ObjectId): Promise<any>
}