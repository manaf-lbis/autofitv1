import { ObjectId } from "bson";
import { Vehicle } from "../types/vehicle";
import { IVehicleRepository } from "./interfaces/IVehicleRepository";
import { Types } from "mongoose";
import { VehicleModel,VehicleDocument } from "../models/vehicleModel"
import { ApiError } from "../utils/apiError";
import { BaseRepository } from "./baseRepository";


export class VehicleRepository extends BaseRepository<VehicleDocument> implements IVehicleRepository  {
    
    constructor() {
      super(VehicleModel);
    }
    
      async delete(id: Types.ObjectId ): Promise<void> {
        await VehicleModel.findByIdAndUpdate({_id:id},{isBlocked:true}); 
      }

      async findWithUserId(userId: Types.ObjectId): Promise<VehicleDocument[]> {
        return await VehicleModel.find({ userId,isBlocked:false },{userId:0});
      }

     async updateByUserId(data:Vehicle): Promise<VehicleDocument | null> {

      const {userId,_id} = data
      if(!userId && !_id) throw new ApiError('Invalid Data');

      return await VehicleModel.findOneAndUpdate(
        { _id, userId },
        { ...data },
        { new: true }
      ).lean();

    }

   async blockVehicle(userId: ObjectId, id: ObjectId): Promise<null> {
     return await VehicleModel.findByIdAndUpdate({userId,_id:id},{isBlocked:true},{new:true})
   }

} 
