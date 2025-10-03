import { Types } from "mongoose";
import { TransactionDurations } from "../../../types/transaction";

export interface IPageService {

  primaryInfo(mechanicId: Types.ObjectId): Promise<{
    availability: string;
    messages: number;
  }>;

  dashboard(mechanicId: Types.ObjectId): Promise<{
    reviews: { id: string; reviewerName: string; rating: number; comment: string }[] | null;
    emergencyRequest: {
      _id: Types.ObjectId;
      name: string;
      issue: string;
      description: string;
      location: number[];
      time: Date;
      status: string;
      vehicle: string;
    } | null;
  }>;

  transactions(mechanicId: Types.ObjectId, duration: TransactionDurations, fromStr?: string, toStr?: string): Promise<any>
}
