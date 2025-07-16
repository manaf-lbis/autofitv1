import { IVehicleBrandRepository } from "./interfaces/IvehicleBrandRepository";
import { vehicleBrandModel,VehicleBrandDocument} from "../models/vehicleBrandModel";
import { Types } from "mongoose";
import { BaseRepository } from "./baseRepository";

export class VehicleBrandRepository extends BaseRepository<VehicleBrandDocument> implements IVehicleBrandRepository {

  constructor() {
    super(vehicleBrandModel);
  }

  async findAll(): Promise<VehicleBrandDocument[]> {
    return await vehicleBrandModel.find({},{_id:0,createdAt:0,updatedAt:0,isBlocked:0})
  }

  async findById(id: Types.ObjectId): Promise<VehicleBrandDocument | null> {
    return await vehicleBrandModel.findById(id).lean();
  }

}
