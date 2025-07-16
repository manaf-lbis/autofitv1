import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ApiError } from "../../utils/apiError";
import { CreateUserInput } from "../../types/user/userInput";
import { IUserRegistrationService } from "./Interface/IUserRegistrationService";
import { HttpStatus } from "../../types/responseCode";
import { Role } from "../../types/role";


export class UserRegistrationService implements IUserRegistrationService {

    constructor(private _userRepository: IUserRepository) {}

    async registerUser(userData:CreateUserInput ) {
        const { email, password, name, mobile } = userData;

        if (!email || !password || !name || !mobile) {
            throw new ApiError("Incomplete user data", HttpStatus.BAD_REQUEST);
        }

        const existingUser = await this._userRepository.findByEmail(email);
        
        if (existingUser) {
            throw new ApiError("User already exists", HttpStatus.BAD_REQUEST);
        }

    const {role,_id} = await this._userRepository.save({email,password,mobile,name,role:Role.USER});
        return {_id:_id.toString(),name,role}
          
    }

    async allUsers() {
      return await this._userRepository.findAll()
    }


}