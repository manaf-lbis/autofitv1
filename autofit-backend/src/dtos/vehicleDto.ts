

export interface VehicleDTO {
    regNo: string;
    brand: string;
    modelName: string;
    fuelType: string;
    owner: string
};


export class VehicleMapper {
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