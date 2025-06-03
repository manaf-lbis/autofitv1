import { IBaseRepository } from "./IBaseRepository"
import { Vehicle } from "../../types/vehicle"
import { ObjectId } from "mongodb"
import { VehicleDocument } from "../../models/vehicleModel"


export interface IVehicleRepository extends IBaseRepository <VehicleDocument> {

    findWithUserId(id:ObjectId) : Promise <VehicleDocument[] | null>  
    updateByUserId(data:Vehicle) : Promise <VehicleDocument | null>  
    blockVehicle(userId:ObjectId ,id:ObjectId) : Promise<null>
}

