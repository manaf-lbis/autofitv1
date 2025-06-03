import { ObjectId } from "mongodb";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import {  MechanicRegisterInput } from "../../types/mechanic";
import { Types } from "mongoose";


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
    private mechanicProfileRepository: IMechanicProfileRepository,
    private mechanicRepository: IMechanicRepository
  ) { }

 
  async registerUser(payload: MechanicRegisterPayload): Promise<void> {
    const { data, photo, shopImage, qualification, mechanicId } = payload;

    const mech = await this.mechanicRepository.findById(mechanicId);
    if (!mech) throw new ApiError('Mechanic not found', 404);

    const toCreate = {
        ...data,
        photo: photo.path,
        shopImage: shopImage.path,
        qualification:qualification.path,
        mechanicId,
    };

    await this.mechanicProfileRepository.create(toCreate);
  }


  async getProfile(mechanicId: ObjectId) {
    try {

      const profile = await this.mechanicProfileRepository.findByMechanicId(mechanicId);
      if (!profile) return null;

      const { _id, mechanicId: mid, updatedAt, ...filteredProfile } = profile

      return filteredProfile;

    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Error retrieving profile: ${(err as Error).message}`, 500);
    }
  }

  async changeStatus ({profileId,status}:{profileId:Types.ObjectId,status:'approved' | 'rejected'}){
    await this.mechanicProfileRepository.updateApplicationStatus(profileId,status)
  }

  async deleteApplication (mechanicId :Types.ObjectId){
    await this.mechanicProfileRepository.deleteByMechanicId(mechanicId)
  }




}