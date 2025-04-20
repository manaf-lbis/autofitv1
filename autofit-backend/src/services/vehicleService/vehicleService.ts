import { ObjectId, Types } from "mongoose";
import { VehicleRepository } from "../../repositories/vehicleRepository";
import { VehicleBrandRepository } from "../../repositories/vehicleBrandRepository";
import { ApiError } from "../../utils/apiError";
import { Vehicle } from "../../types/vehicle";


export class VehicleService {

    constructor(
        private vehicleRepository : VehicleRepository,
        private vehicleBrandRepository :VehicleBrandRepository
    ){}

    async addVehicle(vehicle:Vehicle){
       return await this.vehicleRepository.save(vehicle);
        
    }

    async getVehicle(userId:Types.ObjectId){
        return await this.vehicleRepository.findWithUserId(userId)
    }

    async updateVehicle( data : Vehicle){
      if(!data._id) throw new ApiError('user not found',404)

      await this.vehicleRepository.updateByUserId(data)
    }

    async deleteVehicle(userId:Types.ObjectId,id:Types.ObjectId){
      this.vehicleRepository.blockVehicle(userId,id)

    }

    async getVehicleBrands (){
      return await this.vehicleBrandRepository.findAll()
    }


    async addVehicleBrands (){
      return await this.vehicleBrandRepository.save({brand:'test',models:['1'],isBlocked:false})//testing
    }

    


}