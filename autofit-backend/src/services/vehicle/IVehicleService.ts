import { Types } from "mongoose";
import { Vehicle } from "../../types/vehicle";
import { VehicleDocument } from "../../models/vehicleModel";
import { VehicleBrandDocument } from "../../models/vehicleBrandModel";
import { VehicleWithId } from "../../dtos/vehicleDto";

export interface IVehicleService {
  addVehicle(vehicle: Vehicle): Promise<VehicleDocument>;
  getVehicle(userId: Types.ObjectId): Promise<VehicleWithId[]>;
  updateVehicle(data: Vehicle): Promise<void>;
  deleteVehicle(userId: Types.ObjectId, id: Types.ObjectId): Promise<void>;
  getVehicleBrands(): Promise<VehicleBrandDocument[]>;
  addVehicleBrands(): Promise<VehicleBrandDocument>;
}
