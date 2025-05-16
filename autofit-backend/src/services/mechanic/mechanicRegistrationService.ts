import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import { CreateUserInput } from "../../types/user/userInput";


export class MechanicRegistrationService {
    constructor(private mechanicRepository: IMechanicRepository) {}

    async registerUser(userData:CreateUserInput ) {
        const { email, password, name, mobile } = userData;

        if (!email || !password || !name || !mobile) {
            throw new ApiError("Incomplete user data", 400);
        }

        const existingUser = await this.mechanicRepository.findByEmail(email);
        
        if (existingUser) {
            throw new ApiError("User already exists", 400);
        }

        const {role,_id} = await this.mechanicRepository.create({email,password,mobile,name,role:'mechanic'});
        return {_id,name,role}
          
    }
}