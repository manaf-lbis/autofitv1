import { Types } from "mongoose";
import { Role } from "../../../../types/role";
import { User } from "../../../../types/user/user";
import { Admin } from "../../../../types/admin"; 

export interface IResetPasswordService {
  verifyEmail(email: string, role: Role): Promise<User | Admin>;
  saveAndSentOtp(email: string, role: Role): Promise<boolean>;
  updatePassword(
    email: string,
    password: string,
    role: Role,
    _id: Types.ObjectId
  ): Promise<void>;
}