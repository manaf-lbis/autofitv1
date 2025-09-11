import { UserWithIdDTO } from "../../../dtos/userDto";
import { CreateUserInput } from "../../../types/user/userInput"; 

export interface IUserRegistrationService {
  registerUser(userData: CreateUserInput): Promise<UserWithIdDTO>;
}
