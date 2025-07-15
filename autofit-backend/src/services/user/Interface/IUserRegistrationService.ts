import { CreateUserInput } from "../../../types/user/userInput"; 
import { UserDocument } from "../../../models/userModel";

export interface IUserRegistrationService {
  registerUser(userData: CreateUserInput): Promise<{ _id: string; name: string; role: string }>;
  allUsers(): Promise<UserDocument[]>;
}
