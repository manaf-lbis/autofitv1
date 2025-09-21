import { Types } from "mongoose";
import { Role } from "../../../../types/role";
import { User } from "../../../../types/user/user";
import { Admin } from "../../../../types/admin"; 
import { Mechanic } from "../../../../types/mechanic/mechanic";

export interface IResetPasswordService {
  verifyEmail(email: string, role: Role): Promise<User | Admin| Mechanic>;
  saveAndSentOtp(email: string, role: Role): Promise<boolean>;
  updatePassword(
    email: string,
    password: string,
    role: Role,
    _id: Types.ObjectId
  ): Promise<void>;
  changePassword(userId: Types.ObjectId, currentPassword: string, newPassword: string, role: Role): Promise<void>;
}