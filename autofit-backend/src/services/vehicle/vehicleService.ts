import { Types } from "mongoose";
import { VehicleRepository } from "../../repositories/vehicleRepository";
import { VehicleBrandRepository } from "../../repositories/vehicleBrandRepository";
import { ApiError } from "../../utils/apiError";
import { Vehicle } from "../../types/vehicle";


export class VehicleService {

    constructor(
        private _vehicleRepository : VehicleRepository,
        private _vehicleBrandRepository :VehicleBrandRepository
    ){}

    async addVehicle(vehicle:Vehicle){
       return await this._vehicleRepository.save(vehicle);
        
    }

    async getVehicle(userId:Types.ObjectId){
        return await this._vehicleRepository.findWithUserId(userId)
    }

    async updateVehicle( data : Vehicle){
      if(!data._id) throw new ApiError('user not found',404)

      await this._vehicleRepository.updateByUserId(data)
    }

    async deleteVehicle(userId:Types.ObjectId,id:Types.ObjectId){
      this._vehicleRepository.blockVehicle(userId,id)

    }

    async getVehicleBrands (){
      return await this._vehicleBrandRepository.findAll()
    }


    async addVehicleBrands (){
      return await this._vehicleBrandRepository.save({brand:'test',models:['1'],isBlocked:false})
    }

    


}