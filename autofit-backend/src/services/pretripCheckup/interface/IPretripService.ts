import { Types } from "mongoose";
import { PretripStatus } from "../../../types/pretrip";

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

export interface Report {
  _id: string,
  name: string,
  condition: string,
  remarks: string | null,
  needsAction: boolean
}


export interface IPretripService {
    createBooking({ coords, mechanicId, planId, slot, vehicleId, userId }:ICreateBookingParams): Promise<any>
    getNearbyMechanics(params: { lat: number; lng: number }): Promise<any>
    weeklySchedules(mechanicId: Types.ObjectId): Promise<any>
    workDetails(mechanicId: Types.ObjectId, serviceId: Types.ObjectId): Promise<any>
    updateStatus(mechanicId : Types.ObjectId,serviceId: Types.ObjectId,status:PretripStatus): Promise<any>
    createReport(mechanicId: Types.ObjectId, serviceId: Types.ObjectId, report: Report[] ,mechanicNotes:string): Promise<any>
}