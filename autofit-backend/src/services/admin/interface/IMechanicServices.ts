import { Types } from "mongoose";
import { MechanicDocument } from "../../../models/mechanicModel";
import { MechanicProfileDocument } from "../../../models/mechanicProfileModel";
import { AdminMechanicDTO } from "../../../dtos/mechnaicDTO";
import { MechanicProfileDetails } from "../../../dtos/mechanicProfileDTO";

export interface PaginationResponse {
  users: AdminMechanicDTO[];
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

export interface MechanicDetails {
  mechanic: AdminMechanicDTO,
  mechanicProfile: MechanicProfileDetails | null
}

export interface IMechanicService {
  allUsers(params: PagenateParams<MechanicDocument>): Promise<PaginationResponse>;
  updataUser(data: { userId: Types.ObjectId; data: Partial<MechanicDocument> }): Promise<void>;
  mechanicDetails(data: { userId: Types.ObjectId; }): Promise<MechanicDetails>;
  mechanicApplications(params: PagenateParams<MechanicProfileDocument>): Promise<any>;
}
