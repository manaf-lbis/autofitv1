import { MechanicRegisterInput } from '../../types/mechanic';
import { IBaseRepository } from '../interfaces/IBaseRepository';
import { MechanicProfileDocument } from '../../models/mechanicProfileModel';
import { Types } from 'mongoose';
import { ProfileStatus } from '../../types/mechanic';



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

} 