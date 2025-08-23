import { Types } from "mongoose";
import { MechanicDocument } from "../../../models/mechanicModel";
import { MechanicProfileDocument } from "../../../models/mechanicProfileModel";

export interface PaginationResponse {
  users: MechanicProfileDocument[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PagenateParams<T> {
  page: number;
  limit: number;
  search?: string;
  sortOrder?: "asc" | "desc"
  sortField?: keyof T
}


export interface IMechanicService {
  allUsers(params: PagenateParams<MechanicDocument>): Promise<{ users: MechanicDocument[]; total: number; page: number; totalPages: number}>;
  updataUser(data: { userId: Types.ObjectId; data: Partial<MechanicDocument>; }): Promise<void>;
  mechanicDetails(data: { userId: Types.ObjectId; }): Promise<{ mechanic: MechanicDocument | null; mechanicProfile: MechanicProfileDocument | null; }>;
  mechanicApplications(params: PagenateParams<MechanicProfileDocument>): Promise<{ users: MechanicProfileDocument[]; total: number; page: number; totalPages: number }>;
}
