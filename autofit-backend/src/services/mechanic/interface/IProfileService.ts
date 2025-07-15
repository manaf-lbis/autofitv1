import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { MechanicProfileDocument } from "../../../models/mechanicProfileModel"; 
import { MechanicRegisterInput } from "../../../types/mechanic/mechanic"; 

interface CloudinaryFile {
  public_id: string;
  filename: string;
}

export interface MechanicRegisterPayload {
  data: MechanicRegisterInput;
  photo: CloudinaryFile;
  shopImage: CloudinaryFile;
  qualification: CloudinaryFile;
  mechanicId: ObjectId;
}

export interface IProfileService {

  registerUser(payload: MechanicRegisterPayload): Promise<void>;

  getProfile(mechanicId: ObjectId): Promise<MechanicProfileDocument | null>;

  changeStatus(input: {
    profileId: Types.ObjectId;
    status: "approved" | "rejected";
    rejectionReason?: string;
  }): Promise<void>;

  deleteApplication(mechanicId: Types.ObjectId): Promise<void>;

  getAvailablity(mechanicId: Types.ObjectId): Promise<string>;

  setAvailablity(
    mechanicId: Types.ObjectId,
    updates: Partial<MechanicProfileDocument>
  ): Promise<MechanicProfileDocument | null>;

  setNotificationRead(userId: Types.ObjectId): Promise<any>;
}
