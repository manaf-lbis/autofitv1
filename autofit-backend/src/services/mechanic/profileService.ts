import { ObjectId } from "mongodb";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import { MechanicProfile, MechanicRegisterInput } from "../../types/mechanic";


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
      photo: photo.filename,
      shopImage: shopImage.filename,
      qualification: qualification.filename,
      mechanicId,
    };

    await this.mechanicProfileRepository.create(toCreate);
  }


  async getProfile(mechanicId: ObjectId) {
    try {

      const profile = await this.mechanicProfileRepository.findByMechanicId(mechanicId);
      if (!profile) return null;

      const { _id, mechanicId: mid, createdAt, updatedAt, ...filteredProfile } = profile

      return filteredProfile;

    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Error retrieving profile: ${(err as Error).message}`, 500);
    }
  }




}