import { ObjectId } from 'mongodb';
import { MechanicProfileModel, MechanicProfileDocument } from '../models/mechanicProfileModel';
import { IMechanicProfileRepository } from './interfaces/IMechanicProfileRepository';
import { ApiError } from '../utils/apiError';
import { Types } from 'mongoose';
import { ProfileStatus, MechanicAvailability } from '../types/mechanic/mechanic';
import { BaseRepository } from './baseRepository';


export class MechanicProfileRepository extends BaseRepository<MechanicProfileDocument> implements IMechanicProfileRepository {

  constructor(){
    super(MechanicProfileModel)
  }

  async update(mechanicId: Types.ObjectId, update: Partial<MechanicProfileDocument>): Promise<MechanicProfileDocument | null> {
    try {
      return await MechanicProfileModel
        .findOneAndUpdate({ mechanicId }, update, { new: true })
        .exec();
    } catch (err) {
      throw new ApiError(`Error updating profile: ${(err as Error).message}`, 500);
    }
  }

  async findByMechanicId(mechanicId: ObjectId): Promise<MechanicProfileDocument | null> {
    return await MechanicProfileModel.findOne({ mechanicId }).populate('mechanicId','name').lean().exec();
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

  async updateApplicationStatus(profileId: Types.ObjectId, status: 'approved' | 'rejected', rejectionReason: string): Promise<MechanicProfileDocument | null> {

    let update;

    if (status === 'approved') {
      update = { 'registration.status': status, 'registration.approvedOn': new Date() };

    } else {
      update = { 'registration.status': status, 'registration.rejectedOn': new Date(), 'registration.rejectionReason': rejectionReason };

    }

    return MechanicProfileModel.findOneAndUpdate(
      { _id: profileId },
      { $set: update },
      { new: true }
    );
  }

  async deleteByMechanicId(mechanicId: Types.ObjectId): Promise<void> {
    await MechanicProfileModel.deleteOne({ mechanicId });
  }

  async getProfileStatus(mechanicId: Types.ObjectId): Promise<ProfileStatus | null> {
    return await MechanicProfileModel.findOne({ mechanicId }, { 'registration.status': 1, _id: 0 })
  }

  async getAvailablity(mechanicId: Types.ObjectId): Promise<MechanicAvailability | null> {
    return await MechanicProfileModel.findOne({ mechanicId }, { availability: 1, _id: 0 })
  }

  async findMechnaicWithRadius({ radius, lat, lng }: { radius: number; lat: number; lng: number; }) {
    const EARTH_RADIUS_KM = 6371;
    const radiusInRadians = radius / EARTH_RADIUS_KM;

    const mechanics = await MechanicProfileModel.aggregate([
      {
        $match: {
          availability: 'available',
          "registration.status": "approved",
          location: {
            $geoWithin: {
              $centerSphere: [[lng, lat], radiusInRadians],
            },
          },
        },
      },
      {
        $lookup: {
          from: "mechanics",
          localField: "mechanicId",
          foreignField: "_id",
          as: "mechanic",
        },
      },
      {
        $unwind: "$mechanic",
      },
      {
        $match: {
          "mechanic.status": "active",
        },
      },
      {
        $project: {
          name: "$mechanic.name",
          mobile: "$mechanic.mobile",
          shopName: 1,
          place: 1,
          "location.coordinates": 1,
          specialised: 1,
          experience: 1,
          status: "$registration.status",
          photo: 1,
          mechanicId: "$mechanic._id",
          _id: 0
        },
      },
    ]);

    return mechanics;
  }

  async findByMechanicIdAndUpdate(mechanicId: Types.ObjectId,entity:Partial<MechanicProfileDocument>): Promise<MechanicProfileDocument | null> {
    return await MechanicProfileModel.findOneAndUpdate({mechanicId},entity,{new:true})
  }

}



// import { ObjectId } from 'mongodb';
// import { MechanicProfileModel, MechanicProfileDocument } from '../models/mechanicProfileModel';
// import { MechanicRegisterInput } from '../types/mechanic/mechanic';
// import { IMechanicProfileRepository } from './interfaces/IMechanicProfileRepository';
// import { ApiError } from '../utils/apiError';
// import { Types } from 'mongoose';
// import { ProfileStatus, MechanicAvailability } from '../types/mechanic/mechanic';


// export class MechanicProfileRepository implements IMechanicProfileRepository {

//   async findById(id: ObjectId): Promise<MechanicProfileDocument | null> {
//     try {
//       return await MechanicProfileModel.findById(id).exec();
//     } catch (err) {
//       throw new ApiError(`Error finding profile by id: ${(err as Error).message}`, 500);
//     }
//   }

//   async findAll(): Promise<MechanicProfileDocument[] | null> {
//     try {
//       return await MechanicProfileModel.find().exec();
//     } catch (err) {
//       throw new ApiError(`Error finding all profiles: ${(err as Error).message}`, 500);
//     }
//   }

//   async save(entity: MechanicProfileDocument): Promise<MechanicProfileDocument> {
//     try {
//       const created = new MechanicProfileModel(entity);
//       return await created.save();
//     } catch (err) {
//       throw new ApiError(`Error saving profile: ${(err as Error).message}`, 500);
//     }
//   }

//   async update(mechanicId: Types.ObjectId, update: Partial<MechanicProfileDocument>): Promise<MechanicProfileDocument | null> {
//     try {
//       return await MechanicProfileModel
//         .findOneAndUpdate({ mechanicId }, update, { new: true })
//         .exec();
//     } catch (err) {
//       throw new ApiError(`Error updating profile: ${(err as Error).message}`, 500);
//     }
//   }

//   async delete(id: Types.ObjectId): Promise<void> {
//     try {
//       await MechanicProfileModel.findByIdAndDelete(id).exec();
//     } catch (err) {
//       throw new ApiError(`Error deleting profile: ${(err as Error).message}`, 500);
//     }
//   }

//   async findByMechanicId(mechanicId: ObjectId): Promise<MechanicProfileDocument | null> {
//     return await MechanicProfileModel.findOne({ mechanicId }).lean().exec();
//   }

//   async create(entity: MechanicRegisterInput): Promise<MechanicProfileDocument> {
//     try {
//       const created = new MechanicProfileModel(entity);
//       return await created.save();
//     } catch (err) {
//       throw new ApiError(`Error Creating Mechanic: ${(err as Error).message}`, 500);
//     }

//   }

//   async findMechanicWithPagination(params: { page: number; limit: number; search?: string; sortField?: keyof MechanicProfileDocument; sortOrder?: 'asc' | 'desc'; }): Promise<{
//     users: MechanicProfileDocument[]; total: number; page: number; totalPages: number;
//   }> {
//     try {
//       const { page, limit, search, sortField, sortOrder } = params;
//       const skip = (page - 1) * limit;

//       const query: any = {
//         'registration.status': 'pending',
//       };

//       if (search) {
//         query.$or = [
//           { shopName: { $regex: search, $options: 'i' } },
//           { place: { $regex: search, $options: 'i' } },
//         ];
//       }

//       const sort: any = {};
//       if (sortField && sortOrder) {
//         sort[sortField] = sortOrder === 'asc' ? 1 : -1;
//       } else {
//         sort.createdAt = -1;
//       }

//       const total = await MechanicProfileModel.countDocuments(query).exec();

//       const users = await MechanicProfileModel
//         .find(query)
//         .populate('mechanicId', 'name email mobile')
//         .sort(sort)
//         .skip(skip)
//         .limit(limit)
//         .exec();

//       const totalPages = Math.ceil(total / limit);

//       return {
//         users,
//         total,
//         page,
//         totalPages,
//       };
//     } catch (err) {
//       throw new ApiError(`Error fetching pending mechanics with pagination: ${(err as Error).message}`, 500);
//     }
//   }

//   async updateApplicationStatus(profileId: Types.ObjectId, status: 'approved' | 'rejected', rejectionReason: string): Promise<MechanicProfileDocument | null> {

//     let update;

//     if (status === 'approved') {
//       update = { 'registration.status': status, 'registration.approvedOn': new Date() };

//     } else {
//       update = { 'registration.status': status, 'registration.rejectedOn': new Date(), 'registration.rejectionReason': rejectionReason };

//     }

//     return MechanicProfileModel.findOneAndUpdate(
//       { _id: profileId },
//       { $set: update },
//       { new: true }
//     );
//   }

//   async deleteByMechanicId(mechanicId: Types.ObjectId): Promise<void> {
//     await MechanicProfileModel.deleteOne({ mechanicId });
//   }

//   async getProfileStatus(mechanicId: Types.ObjectId): Promise<ProfileStatus | null> {
//     return await MechanicProfileModel.findOne({ mechanicId }, { 'registration.status': 1, _id: 0 })
//   }

//   async getAvailablity(mechanicId: Types.ObjectId): Promise<MechanicAvailability | null> {
//     return await MechanicProfileModel.findOne({ mechanicId }, { availability: 1, _id: 0 })
//   }

//   async findMechnaicWithRadius({ radius, lat, lng }: { radius: number; lat: number; lng: number; }) {
//     const EARTH_RADIUS_KM = 6371;
//     const radiusInRadians = radius / EARTH_RADIUS_KM;

//     const mechanics = await MechanicProfileModel.aggregate([
//       {
//         $match: {
//           availability: 'available',
//           "registration.status": "approved",
//           location: {
//             $geoWithin: {
//               $centerSphere: [[lng, lat], radiusInRadians],
//             },
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "mechanics",
//           localField: "mechanicId",
//           foreignField: "_id",
//           as: "mechanic",
//         },
//       },
//       {
//         $unwind: "$mechanic",
//       },
//       {
//         $match: {
//           "mechanic.status": "active",
//         },
//       },
//       {
//         $project: {
//           name: "$mechanic.name",
//           mobile: "$mechanic.mobile",
//           shopName: 1,
//           place: 1,
//           "location.coordinates": 1,
//           specialised: 1,
//           experience: 1,
//           status: "$registration.status",
//           photo: 1,
//           mechanicId: "$mechanic._id",
//           _id: 0
//         },
//       },
//     ]);

//     return mechanics;
//   }

//   async findByMechanicIdAndUpdate(mechanicId: Types.ObjectId,entity:Partial<MechanicProfileDocument>): Promise<MechanicProfileDocument | null> {
//     return await MechanicProfileModel.findOneAndUpdate({mechanicId},entity,{new:true})
//   }

// }



