import { ObjectId } from "mongodb";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IProfileService } from "./interface/IProfileService";
import { MechanicRegisterPayload } from "./interface/IProfileService";
import { HttpStatus } from "../../types/responseCode";


export class ProfileService implements IProfileService {
  constructor(
    private _mechanicProfileRepository: IMechanicProfileRepository,
    private _mechanicRepository: IMechanicRepository,
    private _notificationRepository: INotificationRepository
  ) { }


   async registerUser(payload: MechanicRegisterPayload): Promise<void> {
    const { data, photo, shopImage, qualification, mechanicId } = payload;

    const mech = await this._mechanicRepository.findById(mechanicId);
    if (!mech) throw new ApiError('Mechanic not found', HttpStatus.NOT_FOUND);

    const photoId = photo.public_id || photo.filename;
    const shopImageId = shopImage.public_id || shopImage.filename;
    const qualificationId = qualification.public_id || qualification.filename;

    const toCreate = {
      ...data,
      photo: photoId,
      shopImage: shopImageId,
      qualification: qualificationId, 
      mechanicId,
    };

    console.log('Service File IDs:', { photoId, shopImageId, qualificationId });

    await this._mechanicRepository.update(mech._id, { avatar: photoId });
    await this._mechanicProfileRepository.save(toCreate);
  }


  async getProfile(mechanicId: ObjectId) {
    try {

      const profile = await this._mechanicProfileRepository.findByMechanicId(mechanicId);
      if (!profile) return null;
      return profile;
      
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Error retrieving profile: ${(err as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeStatus({ profileId, status, rejectionReason }: { profileId: Types.ObjectId, status: 'approved' | 'rejected', rejectionReason?: string }) {
    await this._mechanicProfileRepository.updateApplicationStatus(profileId, status, rejectionReason)
  }

  async deleteApplication(mechanicId: Types.ObjectId) {
    await this._mechanicProfileRepository.deleteByMechanicId(mechanicId)
  }

  async getAvailablity(mechanicId: Types.ObjectId) {
    const response = await this._mechanicProfileRepository.getAvailablity(mechanicId)
    const availability = response?.availability ?? 'notAvailable'
    return availability

  }

  async setAvailablity(mechanicId: Types.ObjectId, updates: Partial<MechanicProfileDocument>) {
    return await this._mechanicProfileRepository.update(mechanicId, updates)
  }

  async setNotificationRead(userId: Types.ObjectId) {
    return await this._notificationRepository.markAsRead(userId)
  }


}