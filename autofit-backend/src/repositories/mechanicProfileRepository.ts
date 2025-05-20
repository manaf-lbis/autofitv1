import { ObjectId } from 'mongodb';
import { MechanicProfileModel } from '../models/mechanicProfileModel';
import { MechanicProfile, MechanicRegisterInput } from '../types/mechanic';
import { IMechanicProfileRepository } from './interfaces/IMechanicProfileRepository';
import { ApiError } from '../utils/apiError';

export class MechanicProfileRepository implements IMechanicProfileRepository {
  async findById(id: ObjectId): Promise<MechanicProfile | null> {
    try {
      return await MechanicProfileModel.findById(id).exec();
    } catch (err) {
      throw new ApiError(`Error finding profile by id: ${(err as Error).message}`, 500);
    }
  }

  async findAll(): Promise<MechanicProfile[] | null> {
    try {
      return await MechanicProfileModel.find().exec();
    } catch (err) {
      throw new ApiError(`Error finding all profiles: ${(err as Error).message}`, 500);
    }
  }

  async save(entity: MechanicProfile): Promise<MechanicProfile> {
    try {
      const created = new MechanicProfileModel(entity);
      return await created.save();
    } catch (err) {
      throw new ApiError(`Error saving profile: ${(err as Error).message}`, 500);
    }
  }

  async update(id: string, update: Partial<MechanicProfile>): Promise<MechanicProfile | null> {
    try {
      return await MechanicProfileModel
        .findByIdAndUpdate(id, update, { new: true })
        .exec();
    } catch (err) {
      throw new ApiError(`Error updating profile: ${(err as Error).message}`, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await MechanicProfileModel.findByIdAndDelete(id).exec();
    } catch (err) {
      throw new ApiError(`Error deleting profile: ${(err as Error).message}`, 500);
    }
  }

  async findByMechanicId(mechanicId: ObjectId): Promise<MechanicProfile | null> {
    return await MechanicProfileModel.findOne({ mechanicId }).lean().exec();
  }

  async create(entity: MechanicRegisterInput): Promise<MechanicProfile> {
     try {
      const created = new MechanicProfileModel(entity);
      return await created.save();
    } catch (err) {
      throw new ApiError(`Error Creating Mechanic: ${(err as Error).message}`, 500);
    }
    
  }
}