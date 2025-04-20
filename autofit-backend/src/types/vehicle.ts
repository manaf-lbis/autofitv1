import { Types } from "mongoose";

export interface Vehicle {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  regNo: string;
  brand: string;
  modelName: string;
  fuelType: 'Petrol' | 'Diesel';
  owner: string;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVehicleBrand {
  _id?: Types.ObjectId,
  brand: string;
  models: string[];
  isBlocked:boolean;
  createdAt: Date;
  updatedAt: Date;
}