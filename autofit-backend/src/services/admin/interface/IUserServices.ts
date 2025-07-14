import { Types } from "mongoose";
import { User } from "../../../types/user/user";
import { VehicleDocument } from "../../../models/vehicleModel";
import { UserDocument } from "../../../models/userModel";

export interface IUserService {
  allUsers(params: {
    page: number;
    limit: number;
    search?: string;
    sortField?: keyof User;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    users: UserDocument[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  updataUser(data: {
    userId: Types.ObjectId;
    data: Partial<User>;
  }): Promise<void>;

  userDetails(data: {
    userId: Types.ObjectId;
  }): Promise<{
    userData: Pick<User, "email" | "mobile" | "name" | "status" | "createdAt" | "_id">;
    vehicles: VehicleDocument[];
  }>;
}