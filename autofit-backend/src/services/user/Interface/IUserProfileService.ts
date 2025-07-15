import { Types } from "mongoose";
import { RoadsideAssistanceDocument } from "../../../models/roadsideAssistanceModel";
import { UserDocument } from "../../../models/userModel";


export interface IUserProfileService {
  updateUser(params: {
    name: string;
    email: string;
    mobile: string;
    userId: Types.ObjectId;
  }): Promise<UserDocument | null>; 

  serviceHistoryByUserId(userId: Types.ObjectId): Promise<RoadsideAssistanceDocument[]>;
}
