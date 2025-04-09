import { IBaseRerpository } from "./IBaseRepository"
import { User } from "../../types/user"
import { CreateUserInput } from "../../types/user/userInput"


export interface IUserRepository extends IBaseRerpository <User> {
    findByEmail(email :string) : Promise<User | null>
    create(user:CreateUserInput): Promise<User>
}

