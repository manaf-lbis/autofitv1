

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

  approveQuoteAndPay(params: {
    serviceId: Types.ObjectId;
    quotationId: Types.ObjectId;
    userId: Types.ObjectId;
  }): Promise<any>;

  VerifyPaymentAndApprove(params: {
    paymentId: string;
    orderId: string;
    signature: string;
    userId: Types.ObjectId;
  }): Promise<any>;
}
