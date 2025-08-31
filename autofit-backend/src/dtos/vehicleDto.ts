import { VehicleDocument } from "../models/vehicleModel";

export interface BasicVehicleDTO {
    regNo: string;
    brand: string;
    modelName: string;
    owner: string
}

export interface VehicleDTO extends BasicVehicleDTO {
    fuelType: string;
};


export class VehicleMapper {

    static toBasicVehicleDto(vehicle: VehicleDocument): BasicVehicleDTO {
        return {
            regNo: vehicle.regNo,
            brand: vehicle.brand,
            modelName: vehicle.modelName,
            owner: vehicle.owner
        };
    }
    static toVehicleDto(vehicle: any): VehicleDTO {
        return {
            regNo: vehicle.regNo,
            brand: vehicle.brand,
            modelName: vehicle.modelName,
            fuelType: vehicle.fuelType,
            owner: vehicle.owner
        };
    }




}