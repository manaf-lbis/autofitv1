import { Types } from "mongoose";
import { MechanicDocument } from "../../../models/mechanicModel";
import { MechanicProfileDocument } from "../../../models/mechanicProfileModel";

export interface IMechanicService {
  allUsers(params: { page: number; limit: number; search?: string; sortField?: keyof MechanicDocument; sortOrder?: "asc" | "desc"; }): Promise<{
    users: MechanicDocument[]; total: number; page: number; totalPages: number;
  }>;
  updataUser(data: { userId: Types.ObjectId; data: Partial<MechanicDocument>; }): Promise<void>;
  mechanicDetails(data: { userId: Types.ObjectId; }): Promise<{ mechanic: MechanicDocument | null; mechanicProfile: MechanicProfileDocument | null; }>;
  mechanicApplications(params: {page: number;limit: number;search?: string;sortField?: keyof MechanicProfileDocument; sortOrder?: "asc" | "desc";
  }): Promise<{ users: MechanicProfileDocument[]; total: number; page: number; totalPages: number }>;
}
