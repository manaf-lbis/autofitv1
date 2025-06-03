import { ObjectId } from 'mongodb';
import { MechanicProfileModel, MechanicProfileDocument } from '../models/mechanicProfileModel';
import { MechanicRegisterInput } from '../types/mechanic';
import { IMechanicProfileRepository } from './interfaces/IMechanicProfileRepository';
import { ApiError } from '../utils/apiError';
import { Types } from 'mongoose';

export class MechanicProfileRepository implements IMechanicProfileRepository {
  async findById(id: ObjectId): Promise<MechanicProfileDocument | null> {
    try {
      return await MechanicProfileModel.findById(id).exec();
    } catch (err) {
      throw new ApiError(`Error finding profile by id: ${(err as Error).message}`, 500);
    }
  }

  async findAll(): Promise<MechanicProfileDocument[] | null> {
    try {
      return await MechanicProfileModel.find().exec();
    } catch (err) {
      throw new ApiError(`Error finding all profiles: ${(err as Error).message}`, 500);
    }
  }

  async save(entity: MechanicProfileDocument): Promise<MechanicProfileDocument> {
    try {
      const created = new MechanicProfileModel(entity);
      return await created.save();
    } catch (err) {
      throw new ApiError(`Error saving profile: ${(err as Error).message}`, 500);
    }
  }

  async update(id: Types.ObjectId, update: Partial<MechanicProfileDocument>): Promise<MechanicProfileDocument | null> {
    try {
      return await MechanicProfileModel
        .findByIdAndUpdate(id, update, { new: true })
        .exec();
    } catch (err) {
      throw new ApiError(`Error updating profile: ${(err as Error).message}`, 500);
    }
  }

  async delete(id: Types.ObjectId): Promise<void> {
    try {
      await MechanicProfileModel.findByIdAndDelete(id).exec();
    } catch (err) {
      throw new ApiError(`Error deleting profile: ${(err as Error).message}`, 500);
    }
  }

  async findByMechanicId(mechanicId: ObjectId): Promise<MechanicProfileDocument | null> {
    return await MechanicProfileModel.findOne({ mechanicId }).lean().exec();
  }

  async create(entity: MechanicRegisterInput): Promise<MechanicProfileDocument> {
    try {
      const created = new MechanicProfileModel(entity);
      return await created.save();
    } catch (err) {
      throw new ApiError(`Error Creating Mechanic: ${(err as Error).message}`, 500);
    }

  }

  async findMechanicWithPagination(params: { page: number; limit: number; search?: string; sortField?: keyof MechanicProfileDocument; sortOrder?: 'asc' | 'desc'; }): Promise<{
    users: MechanicProfileDocument[]; total: number; page: number; totalPages: number;
  }> {
    try {
      const { page, limit, search, sortField, sortOrder } = params;
      const skip = (page - 1) * limit;

      const query: any = {
        'registration.status': 'pending',
      };

      if (search) {
        query.$or = [
          { shopName: { $regex: search, $options: 'i' } },
          { place: { $regex: search, $options: 'i' } },
        ];
      }

      const sort: any = {};
      if (sortField && sortOrder) {
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;
      } else {
        sort.createdAt = -1;
      }

      const total = await MechanicProfileModel.countDocuments(query).exec();

      const users = await MechanicProfileModel
        .find(query)
        .populate('mechanicId', 'name email mobile')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

      const totalPages = Math.ceil(total / limit);

      return {
        users,
        total,
        page,
        totalPages,
      };
    } catch (err) {
      throw new ApiError(`Error fetching pending mechanics with pagination: ${(err as Error).message}`, 500);
    }
  }

  async updateApplicationStatus( profileId: Types.ObjectId,  status: 'approved' | 'rejected'): Promise<MechanicProfileDocument | null> {
    const update = {  'registration.status': status, 'registration.date': new Date()};

    return MechanicProfileModel.findOneAndUpdate(
      { _id: profileId },
      { $set: update },
      { new: true }
    );
  }



}



