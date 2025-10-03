import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { MechanicProfileDocument } from "../../../models/mechanicProfileModel";
import { IMechanicTiming, MechanicRegisterInput } from "../../../types/mechanic/mechanic";

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

export interface UpdateProfile {
  name?: string;
  email?: string;
  mobile?: string;
  education?: string;
  specialised?: string;
  experience?: number;
  shopName?: string;
  place?: string;
  landmark?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface IScheduleDetails {
  date: string,
  isFullDayBlock:boolean,
  blockedTiming: {
    from: string,
    to: string
  },
  reason: string
}


export interface IProfileService {

  registerUser(payload: MechanicRegisterPayload): Promise<void>;
  updateUser(mechanicId: Types.ObjectId, updates: UpdateProfile): Promise<void>;

  getProfile(mechanicId: ObjectId): Promise<any | null>;

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

  getWorkingHours(mechanicId: Types.ObjectId): Promise<any>;
  createWorkingHours(mechanicId: Types.ObjectId, workingHours: Omit<IMechanicTiming, "mechanicId">): Promise<void>;
  updateWorkingHours(mechanicId: Types.ObjectId, workingHours: Omit<IMechanicTiming, "mechanicId">): Promise<void>;

  blockSchedule(mechanicId: Types.ObjectId, scheduleDetails: IScheduleDetails): Promise<void>;
  unblockSchedule(mechanicId: Types.ObjectId, id:Types.ObjectId): Promise<void>;
  listReviews(mechanicId: Types.ObjectId, page: number, sort: string): Promise<any>;

}
