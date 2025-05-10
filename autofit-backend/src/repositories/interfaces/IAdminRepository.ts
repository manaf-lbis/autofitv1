import { IBaseRepository } from "./IBaseRepository"
import { Admin } from "../../types/admin"
import { Types } from "mongoose"


export interface IAdminRepository extends IBaseRepository<Admin> {
    findByEmail(email:string):Promise<Admin | null>
    getRefreshToken(userId: Types.ObjectId): Promise<string | null> 
    storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void>
}