import { ObjectId } from "mongodb";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import { MechanicRegisterInput } from "../../types/mechanic/mechanic";
import { Types } from "mongoose";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";


type FileWithField = Express.Multer.File;

interface MechanicRegisterPayload {
  data: MechanicRegisterInput;
  photo: FileWithField;
  shopImage: FileWithField;
  qualification: FileWithField;
  mechanicId: ObjectId
}

export class ProfileService {
  constructor(
    private _mechanicProfileRepository: IMechanicProfileRepository,
    private _mechanicRepository: IMechanicRepository,
    private _notificationRepository: INotificationRepository
  ) { }


  async registerUser(payload: MechanicRegisterPayload): Promise<void> {
    const { data, photo, shopImage, qualification, mechanicId } = payload;

    const mech = await this._mechanicRepository.findById(mechanicId);
    if (!mech) throw new ApiError('Mechanic not found', 404);

    const toCreate = {
      ...data,
      photo: photo.path,
      shopImage: shopImage.path,
      qualification: qualification.path,
      mechanicId,
    };

    await this._mechanicRepository.update(mech._id, { avatar: photo.path });
    await this._mechanicProfileRepository.create(toCreate);
  }


  async getProfile(mechanicId: ObjectId) {
    try {

      const profile = await this._mechanicProfileRepository.findByMechanicId(mechanicId);
      if (!profile) return null;

      const { _id, mechanicId: mid, updatedAt, ...filteredProfile } = profile

      return filteredProfile;

    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Error retrieving profile: ${(err as Error).message}`, 500);
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