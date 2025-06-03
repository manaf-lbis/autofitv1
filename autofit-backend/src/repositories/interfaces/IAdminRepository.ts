import { IBaseRepository } from "./IBaseRepository"
import { Admin } from "../../types/admin"
import { Types } from "mongoose"
import { AdminDocument } from "../../models/adminModel"

export interface IAdminRepository extends IBaseRepository<AdminDocument> {
    findByEmail(email:string):Promise<AdminDocument | null>
    getRefreshToken(userId: Types.ObjectId): Promise<string | null> 
    storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void>
}