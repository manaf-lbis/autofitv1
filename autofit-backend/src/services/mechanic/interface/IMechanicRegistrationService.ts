import { CreateUserInput } from "../../../types/user/userInput";

export interface IMechanicRegistrationService {
  registerUser(userData: CreateUserInput): Promise<{ _id: string; name: string; role: string }>;
}
