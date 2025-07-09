import { NextFunction, Request, Response } from 'express';
import { VehicleService } from '../../services/vehicle/vehicleService';
import { Types } from 'mongoose';
import { sendSuccess } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';



export class VehicleController {
    constructor(
        private _vehicleService : VehicleService
    ){}

    
    async addVehicle(req: Request, res: Response,next:NextFunction): Promise<void>{
        try {
            const {regNo,brand,modelName,fuelType,owner} = req.body

            const userId = req.user?.id
            if(!userId) throw new ApiError('User UnAuthorised',401)

            const newVehicle = await this._vehicleService.addVehicle({regNo,brand,modelName,fuelType,owner,userId})
          
            sendSuccess(res,'New Vehicle Added',newVehicle,201)
            
        } catch (error) {
            next(error)
            
        }
    }

    async getVehicles(req: Request, res: Response):Promise<void> {
        try {

            const userId = new Types.ObjectId(req.user?.id);
            if(!userId) throw new ApiError('user Unauthenticated', 401);

            const response = await this._vehicleService.getVehicle(userId)
            sendSuccess(res,'vehicle Fetch Success',response)

            
        } catch (error) {
            console.log(error);
            
        }
    }

    async updateVehicle (req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const {regNo,brand,modelName,fuelType,owner,id:_id} = req.body;

            const userId = new Types.ObjectId(req.user?.id);
            if(!userId) throw new ApiError('user Unauthenticated', 401);

            const response = await this._vehicleService.updateVehicle({regNo,brand,modelName,fuelType,owner,userId,_id})
        
            sendSuccess(res,'update Success',response);

        } catch (error) {
            next(error)
        }
    }

    async removeVehicle (req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
          const id = req.query.id

          if(!req.user?.id) throw new ApiError('user Unauthenticated', 401);
          if(!id) throw new ApiError('Invalid Parameters', 401);

          const userId = new Types.ObjectId(req.user?.id);
          const _id = new Types.ObjectId(id as string);


          const response = this._vehicleService.deleteVehicle(userId,_id);
          sendSuccess(res,'Vehicle Removed',response)


        } catch (error) {
            next(error) 
        }
    }
    async vehicleBrands (req: Request, res: Response,next:NextFunction): Promise<void>{
        try {
           const response = await this._vehicleService.getVehicleBrands()

           sendSuccess(res,'vehicle Fetched Successfully',response)
            
        } catch (error) {
            next(error)
        }
    }


    
}