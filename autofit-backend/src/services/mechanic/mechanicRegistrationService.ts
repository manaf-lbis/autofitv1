import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import { CreateUserInput } from "../../types/user/userInput";
import { IMechanicRegistrationService } from "./interface/IMechanicRegistrationService";


export class MechanicRegistrationService implements IMechanicRegistrationService {

    constructor(private _mechanicRepository: IMechanicRepository) {}

    async registerUser(userData:CreateUserInput ) {
        const { email, password, name, mobile } = userData;

        if (!email || !password || !name || !mobile) {
            throw new ApiError("Incomplete user data", 400);
        }

        const existingUser = await this._mechanicRepository.findByEmail(email);
        
        if (existingUser) {
            throw new ApiError("User already exists", 400);
        }

        const {role,_id} = await this._mechanicRepository.save({email,password,mobile,name,role:'mechanic'});
        return {_id:_id.toString(),name,role}
          
    }
}