import { ObjectId } from 'bson';
import { MechanicProfile, MechanicRegisterInput } from '../../types/mechanic';
import { IBaseRepository } from '../interfaces/IBaseRepository';

export interface IMechanicProfileRepository extends IBaseRepository<MechanicProfile> {
  findByMechanicId(mechanicId: ObjectId): Promise<MechanicProfile | null>;
  create(payload:MechanicRegisterInput ): Promise<MechanicProfile>
} 