import { Types } from "mongoose";
import { UserBasicInfoDTO } from "../../../dtos/userDto";
import { RoadsideAssistanceDTO } from "../../../dtos/roadsideAssistanceDTO"; 
import { PretripDTO } from "../../../dtos/pretripDto";
import { LiveAssistanceInfoDTO } from "../../../dtos/liveAssistanceDTO";


interface PagenationInfo {
  totalDocuments: number,
  hasMore: boolean
}

export interface RoadsideServiceHistoryResponse extends PagenationInfo {
  history: RoadsideAssistanceDTO[]
}

export interface PretripServiceHistoryResponse extends PagenationInfo {
  history: PretripDTO[]
}

export interface liveAssistanceServiceHistoryResponse extends PagenationInfo {
  history: LiveAssistanceInfoDTO[]
}

export interface IUserProfileService {
  updateUser(params: { name: string; email: string; mobile: string; userId: Types.ObjectId; }): Promise<UserBasicInfoDTO>;
  roadsideServiceHistory(userId: Types.ObjectId, page: number): Promise<RoadsideServiceHistoryResponse>;
  pretripServiceHistory(userId: Types.ObjectId, page: number): Promise<PretripServiceHistoryResponse>;
  liveAssistanceServiceHistory(userId: Types.ObjectId, page: number): Promise<liveAssistanceServiceHistoryResponse>;
  changePassword(userId: Types.ObjectId, currentPassword: string, newPassword: string): Promise<any>;
}
