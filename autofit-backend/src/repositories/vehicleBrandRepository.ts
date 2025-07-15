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



// import { IVehicleBrandRepository } from "./interfaces/IvehicleBrandRepository";
// import { vehicleBrandModel} from "../models/vehicleBrandModel";
// import { IVehicleBrand } from "../types/vehicle";
// import { ObjectId } from "bson";
// import { VehicleBrandDocument } from "../models/vehicleBrandModel";
// ;

// export class VehicleBrandRepository implements IVehicleBrandRepository {


//   async findAll(): Promise<IVehicleBrand[]> {
//     return await vehicleBrandModel.find({},{_id:0,createdAt:0,updatedAt:0,isBlocked:0})
//   }

//   async findById(id: ObjectId): Promise<IVehicleBrand | null> {
//     return await vehicleBrandModel.findById(id).lean();
//   }

//   async save(entity: any): Promise<IVehicleBrand> {
//     const newBrand = new vehicleBrandModel(entity);
//     return await newBrand.save();
//   }

//   async update(id: string, update: Partial<IVehicleBrand>): Promise<IVehicleBrand | null> {
//     return await vehicleBrandModel.findByIdAndUpdate(id, update, {
//       new: true, 
//       runValidators: true,
//     }).lean();
//   }

//   async delete(id: string): Promise<void> {
//     await vehicleBrandModel.findByIdAndDelete(id);
//   }
// }