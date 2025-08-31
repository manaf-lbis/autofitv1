import { MechanicDetailsWithId } from "../../../dtos/mechnaicDTO";
import { CreateUserInput } from "../../../types/user/userInput";

export interface IMechanicRegistrationService {
  registerUser(userData: CreateUserInput): Promise<MechanicDetailsWithId>;
}
