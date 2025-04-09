import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ApiError } from "../../utils/apiError";
import { CreateUserInput } from "../../types/user/userInput";


export class UserRegistrationService {
    constructor(private userRepository: IUserRepository) {}

    async registerUser(userData:CreateUserInput ) {
        const { email, password, name, mobile } = userData;

        if (!email || !password || !name || !mobile) {
            throw new ApiError("Incomplete user data", 400);
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ApiError("User already exists", 400);
        }

        const {_id,role} = await this.userRepository.create({email,password,mobile,name,role:'user'});
        return {name,_id,role}
          
    }
}