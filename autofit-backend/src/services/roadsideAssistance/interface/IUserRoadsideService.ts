

import { Types } from "mongoose";
import { MechanicNearbyDto } from "../../../types/mechanic/mechanic";

export interface IUserRoadsideService {
  getNearByMechanic(params: { lat: number; lng: number }): Promise<MechanicNearbyDto[]>;

  createAssistanceRequest(params: {
    mechanicId: Types.ObjectId;
    vehicleId: Types.ObjectId;
    issue: string;
    description: string;
    serviceLocation: [number, number];
  }): Promise<any>;


}
