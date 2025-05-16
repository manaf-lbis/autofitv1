import { ObjectId } from "bson";
import { Mechanic } from "../types/mechanic";
import { IMechanicRepository } from "./interfaces/IMechanicRepository";
import { ApiError } from "../utils/apiError";
import { MechanicModel } from "../models/mechanicModel";


export class MechanicRepository implements IMechanicRepository{

    async findAll(): Promise<Mechanic[] | null> {
           try {
               const mechanics = await MechanicModel.find().exec();
               return mechanics as Mechanic[] | null;
           } catch (error) {
               throw new ApiError(`Error finding all users: ${(error as Error).message}`, 500);
           }
       }
   
       async create(mechanic:Mechanic): Promise<Mechanic> {
           try {
               const newMechanic = new MechanicModel({ ...mechanic });
               const savedMechanic = await newMechanic.save();
               return savedMechanic.toObject() as Mechanic;
           } catch (error) {
               throw new ApiError(`Error creating user: ${(error as Error).message}`, 500);
           }
       }
   
       async findByEmail(email: string): Promise<Mechanic | null> {
           try {
               const mechanic = await MechanicModel.findOne({ email }).exec();
               return mechanic as Mechanic | null;
           } catch (error) {
               throw new ApiError(`Error finding user by email: ${(error as Error).message}`, 500);
           }
       }
   
       async findById(id: ObjectId): Promise<Mechanic | null> {
           try {
               const mechanic = await MechanicModel.findById(id).exec();
               return mechanic as Mechanic | null;
           } catch (error) {
               throw new ApiError(`Error finding user by ID: ${(error as Error).message}`, 500);
           }
       }
   
       async save(user: Mechanic): Promise<Mechanic> {
           try {
               const newMechanic = new MechanicModel(user);
               const savedMechanic= await newMechanic.save();
               return savedMechanic as Mechanic;
           } catch (error) {
               throw new ApiError(`Error saving user: ${(error as Error).message}`, 500);
           }
       }
   
       async update(id: string, update: Partial<Mechanic>): Promise<Mechanic | null> {
           try {
               const updatedMechanic = await MechanicModel.findByIdAndUpdate(id, update, { new: true }).exec();
               if (!updatedMechanic) {
                   throw new ApiError(`User with ID ${id} not found`, 404);
               }
               return updatedMechanic as Mechanic | null;
           } catch (error) {
               if (error instanceof ApiError) throw error;
               throw new ApiError(`Error updating user: ${(error as Error).message}`, 500);
           }
       }
   
       async delete(id: string): Promise<void> {
           try {
               const result = await MechanicModel.findByIdAndDelete(id).exec();
               if (!result) {
                   throw new ApiError(`User with ID ${id} not found`, 404);
               }
           } catch (error) {
               if (error instanceof ApiError) throw error;
               throw new ApiError(`Error deleting user: ${(error as Error).message}`, 500);
           }
       }
   
       async storeRefreshToken(userId: ObjectId, token: string): Promise<void> {
           try {
               const result = await MechanicModel.updateOne({ _id: userId }, { refreshToken: token }).exec();
               if (result.matchedCount === 0) {
                   throw new ApiError(`User with ID ${userId} not found`, 404);
               }
           } catch (error) {
               if (error instanceof ApiError) throw error;
               throw new ApiError(`Error storing refresh token: ${(error as Error).message}`, 500);
           }
       }
   
       async getRefreshToken(userId: ObjectId): Promise<string | null> {
           try {
               const mechanic = await MechanicModel.findById(userId).select('refreshToken').exec();
               if (!mechanic) {
                   throw new ApiError(`User with ID ${userId} not found`, 404);
               }
               return mechanic.refreshToken || null;
           } catch (error) {
               if (error instanceof ApiError) throw error;
               throw new ApiError(`Error retrieving refresh token: ${(error as Error).message}`, 500);
           }
       }
}