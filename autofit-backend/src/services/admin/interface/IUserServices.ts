import { Types } from "mongoose";
import { User } from "../../../types/user/user";
import { VehicleDocument } from "../../../models/vehicleModel";
import { AdminUserResponseDTO } from "../../../dtos/userDto";


export interface PagenateParams {
  page: number;
  limit: number;
  search?: string;
  sortField?: keyof User;
  sortOrder?: "asc" | "desc"
}

export interface PagenatedUserReposnse {
  users: AdminUserResponseDTO[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IUserService {
  allUsers(params: PagenateParams): Promise<PagenatedUserReposnse>;
  updataUser(data: { userId: Types.ObjectId; data: Partial<User>;}): Promise<void>;
  userDetails(data: {userId: Types.ObjectId}): Promise<{ userData: Pick<User, "email" | "mobile" | "name" | "status" | "createdAt" | "_id">; vehicles: VehicleDocument[]}>;

}