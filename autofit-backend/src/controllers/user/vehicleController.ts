import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { sendSuccess } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';
import { HttpStatus } from '../../types/responseCode';
import { IVehicleService } from '../../services/vehicle/IVehicleService';



export class VehicleController {
    constructor(
        private _vehicleService: IVehicleService,
    ) { }


    async addVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { regNo, brand, modelName, fuelType, owner } = req.body

            const userId = req.user?.id
            if (!userId) throw new ApiError('User UnAuthorised', HttpStatus.UNAUTHORIZED)

            const newVehicle = await this._vehicleService.addVehicle({ regNo, brand, modelName, fuelType, owner, userId })

            sendSuccess(res, 'New Vehicle Added', newVehicle, HttpStatus.CREATED)

        } catch (error) {
            next(error)

        }
    }

    async getVehicles(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const userId = new Types.ObjectId(req.user?.id);
            if (!userId) throw new ApiError('user Unauthenticated', HttpStatus.UNAUTHORIZED);
            const response = await this._vehicleService.getVehicle(userId)
            sendSuccess(res, 'vehicle Fetch Success', response)

        } catch (error) {
           next(error)
        }
    }

    async updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { regNo, brand, modelName, fuelType, owner, _id} = req.body;

            const userId = new Types.ObjectId(req.user?.id);
            if (!userId) throw new ApiError('user Unauthenticated', HttpStatus.UNAUTHORIZED);

            const response = await this._vehicleService.updateVehicle({ regNo, brand, modelName, fuelType, owner, userId, _id })

            sendSuccess(res, 'update Success', response);

        } catch (error) {
            next(error)
        }
    }

    async removeVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query.id

            if (!req.user?.id) throw new ApiError('user Unauthenticated', HttpStatus.UNAUTHORIZED);
            if (!id) throw new ApiError('Invalid Parameters', HttpStatus.BAD_REQUEST);

            const userId = new Types.ObjectId(req.user?.id);
            const _id = new Types.ObjectId(id as string);


            const response = this._vehicleService.deleteVehicle(userId, _id);
            sendSuccess(res, 'Vehicle Removed', response)


        } catch (error) {
            next(error)
        }
    }
    
    async vehicleBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._vehicleService.getVehicleBrands()

            sendSuccess(res, 'vehicle Fetched Successfully', response)

        } catch (error) {
            next(error)
        }
    }


}