import { Types } from "mongoose";
import { Vehicle } from "../../types/vehicle";
import { VehicleDocument } from "../../models/vehicleModel";
import { VehicleBrandDocument } from "../../models/vehicleBrandModel";

export interface IVehicleService {
  addVehicle(vehicle: Vehicle): Promise<VehicleDocument>;
  getVehicle(userId: Types.ObjectId): Promise<VehicleDocument[]>;
  updateVehicle(data: Vehicle): Promise<void>;
  deleteVehicle(userId: Types.ObjectId, id: Types.ObjectId): Promise<void>;
  getVehicleBrands(): Promise<VehicleBrandDocument[]>;
  addVehicleBrands(): Promise<VehicleBrandDocument>;
}
