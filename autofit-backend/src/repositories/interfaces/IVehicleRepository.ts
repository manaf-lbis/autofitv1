import { IBaseRerpository } from "./IBaseRepository"
import { Vehicle } from "../../types/vehicle"
import { ObjectId } from "mongodb"



export interface IVehicleRepository extends IBaseRerpository <Vehicle> {

    findWithUserId(id:ObjectId) : Promise <Vehicle[] | null>  
    updateByUserId(data:Vehicle) : Promise <Vehicle | null>  
    blockVehicle(userId:ObjectId ,id:ObjectId) : Promise<null>
}

