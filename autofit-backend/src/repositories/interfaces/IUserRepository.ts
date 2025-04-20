import { IBaseRerpository } from "./IBaseRepository"
import { User } from "../../types/user"
import { CreateUserInput } from "../../types/user/userInput"
import { Types } from "mongoose"


export interface IUserRepository extends IBaseRerpository <User> {
    findByEmail(email :string) : Promise<User | null>
    create(user:CreateUserInput): Promise<User>
    getRefreshToken(userId: Types.ObjectId): Promise<string | null> 
    storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void>
}

