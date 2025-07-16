import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import { CreateUserInput } from "../../types/user/userInput";
import { IMechanicRegistrationService } from "./interface/IMechanicRegistrationService";
import { HttpStatus } from "../../types/responseCode";
import { Role } from "../../types/role";


export class MechanicRegistrationService implements IMechanicRegistrationService {

    constructor(private _mechanicRepository: IMechanicRepository) {}

    async registerUser(userData:CreateUserInput ) {
        const { email, password, name, mobile } = userData;

        if (!email || !password || !name || !mobile) {
            throw new ApiError("Incomplete user data", HttpStatus.BAD_REQUEST);
        }

        const existingUser = await this._mechanicRepository.findByEmail(email);
        
        if (existingUser) {
            throw new ApiError("User already exists", HttpStatus.BAD_REQUEST);
        }

        const {role,_id} = await this._mechanicRepository.save({email,password,mobile,name,role:Role.MECHANIC});
        return {_id:_id.toString(),name,role}
          
    }
}