import { Types } from "mongoose";
import { Mechanic } from "../../types/mechanic";
import { IBaseRepository } from "./IBaseRepository";
import { CreateMechanicInput } from "../../types/mechanic/mechanicInput";

export interface IMechanicRepository extends IBaseRepository<Mechanic> {

    findByEmail(email :string) : Promise<Mechanic | null>
    create(mechanic:CreateMechanicInput): Promise<Mechanic>
    getRefreshToken(userId: Types.ObjectId): Promise<string | null> 
    storeRefreshToken(userId: Types.ObjectId, token: string): Promise<void>
}