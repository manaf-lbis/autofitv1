import { MechanicRegisterInput } from '../../types/mechanic/mechanic';
import { IBaseRepository } from '../interfaces/IBaseRepository';
import { MechanicProfileDocument } from '../../models/mechanicProfileModel';
import { Types } from 'mongoose';
import { ProfileStatus,MechanicAvailability } from '../../types/mechanic/mechanic';



export interface IMechanicProfileRepository extends IBaseRepository<MechanicProfileDocument> {
  findByMechanicId(mechanicId: Types.ObjectId): Promise<MechanicProfileDocument | null>;
  create(payload: MechanicRegisterInput): Promise<MechanicProfileDocument>
  findMechanicWithPagination(params: {
    page: number;
    limit: number;
    search?: string;
    sortField?: keyof MechanicProfileDocument;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    users: MechanicProfileDocument[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  updateApplicationStatus(
    profileId: Types.ObjectId,
    status: 'approved' | 'rejected',
    rejectionReason?:string
  ): Promise<MechanicProfileDocument | null>;

  deleteByMechanicId(mechanicId: Types.ObjectId): Promise<void>;
  getProfileStatus(mechanicId: Types.ObjectId): Promise<ProfileStatus | null>;
  getAvailablity(mechanicId: Types.ObjectId): Promise<MechanicAvailability | null>;
  findMechnaicWithRadius({radius,lat,lng}:{radius:number,lat:number,lng:number}) :Promise<MechanicProfileDocument[]|[]>
} 