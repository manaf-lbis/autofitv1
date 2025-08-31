import { Types } from "mongoose";
import { RoadsideAssistanceDocument } from "../../../models/roadsideAssistanceModel";
import { UserDocument } from "../../../models/userModel";
import { PretripBookingDocument } from "../../../models/pretripBooking";
import { LiveAssistanceDocument } from "../../../models/liveAssistanceModel";


interface PagenationInfo{
  totalDocuments: number,
  hasMore: boolean
}

export interface RoadsideServiceHistoryResponse extends PagenationInfo{
  history: RoadsideAssistanceDocument[]
}

export interface PretripServiceHistoryResponse extends PagenationInfo{
  history: PretripBookingDocument[]
}

export interface liveAssistanceServiceHistoryResponse extends PagenationInfo{
  history: LiveAssistanceDocument[]
}

export interface IUserProfileService {
  updateUser(params: {
    name: string;
    email: string;
    mobile: string;
    userId: Types.ObjectId;
  }): Promise<UserDocument | null>;

  roadsideServiceHistory(userId: Types.ObjectId, page: number): Promise<RoadsideServiceHistoryResponse>;
  pretripServiceHistory(userId: Types.ObjectId, page: number): Promise<PretripServiceHistoryResponse>;
  liveAssistanceServiceHistory(userId: Types.ObjectId, page: number): Promise<liveAssistanceServiceHistoryResponse>;
}
