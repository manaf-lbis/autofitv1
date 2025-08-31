import { ObjectId } from "mongodb";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { MechanicProfileDocument } from "../../models/mechanicProfileModel";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IProfileService, IScheduleDetails } from "./interface/IProfileService";
import { MechanicRegisterPayload } from "./interface/IProfileService";
import { HttpStatus } from "../../types/responseCode";
import { IMechanicTiming } from "../../types/mechanic/mechanic";
import { IWorkingHoursRepository } from "../../repositories/interfaces/IWorkingHoursRepository";
import { workingHoursSchema } from "../../validation/pretripValidations";
import { convertHHMMToMinutes, minutesToWorkingHours, workingHoursToMinutes } from "../../utils/dateAndTimeFormater";
import { ITimeBlockRepository } from "../../repositories/interfaces/ITimeBlockRepository";
import { endOfDay, startOfDay } from "date-fns";
import { BlockType } from "../../models/timeBlock";
import { ZodError } from "zod";


export class ProfileService implements IProfileService {
  constructor(
    private _mechanicProfileRepository: IMechanicProfileRepository,
    private _mechanicRepository: IMechanicRepository,
    private _notificationRepository: INotificationRepository,
    private _workingHoursRepository: IWorkingHoursRepository,
    private _timeBlockingRepo: ITimeBlockRepository
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

  async createWorkingHours(mechanicId: Types.ObjectId, workingHours: Omit<IMechanicTiming, "mechanicId">): Promise<void> {
    try {
      workingHoursSchema.parse(workingHours);
      const converted = workingHoursToMinutes(workingHours)
      await this._workingHoursRepository.save({ ...converted, mechanicId })
    } catch (err: any) {
      if (err instanceof ZodError) {
        throw new ApiError(err.errors[0].message);
      } else {
        throw new ApiError(err)
      }
    }
  }

  async updateWorkingHours(mechanicId: Types.ObjectId, workingHours: Omit<IMechanicTiming, "mechanicId">): Promise<void> {
    try {
      workingHoursSchema.parse(workingHours);
      const converted = workingHoursToMinutes(workingHours)
      await this._workingHoursRepository.updateWorkingHours(mechanicId, converted)
    } catch (err: any) {
      if (err instanceof ZodError) {
        throw new ApiError(err.errors[0].message);
      } else {
        throw new ApiError(err)
      }
    }
  }

  async getWorkingHours(mechanicId: Types.ObjectId): Promise<any> {
    const result = await this._workingHoursRepository.getWorkingHours(mechanicId)
    return minutesToWorkingHours(result)
  }

  async blockSchedule(mechanicId: Types.ObjectId, scheduleDetails: IScheduleDetails): Promise<any> {

    const isFullDayBlock = scheduleDetails.isFullDayBlock
    const blockDate = new Date(scheduleDetails.date);
    const now = new Date();
    if (blockDate < now) throw new ApiError("Cannot block in the past", HttpStatus.BAD_REQUEST);

    const from = isFullDayBlock ? 0 : convertHHMMToMinutes(scheduleDetails.blockedTiming.from);
    const to = isFullDayBlock ? 1439 : convertHHMMToMinutes(scheduleDetails.blockedTiming.to);
    if (from > to) throw new ApiError("Invalid time range", HttpStatus.BAD_REQUEST);

    const dayStart = startOfDay(blockDate)
    const dayEnd = endOfDay(blockDate)

    const blockingOfDay = await this._timeBlockingRepo.findBlockingByDateRange(mechanicId, dayStart, dayEnd);

    const hasConflict = blockingOfDay.some(({ startMinutes, endMinutes }) => {
      return from < endMinutes && to > startMinutes
    });

    if (hasConflict) throw new ApiError("Schedule already blocked", HttpStatus.BAD_REQUEST);

    const data = await this._timeBlockingRepo.save({
      startMinutes: from,
      endMinutes: to,
      mechanicId,
      date: dayStart,
      blockType: BlockType.MECHANIC_BLOCK,
      reason: scheduleDetails.reason.trim(),
    });

    return {
      status: data.blockType
    }
  }


  async unblockSchedule(mechanicId: Types.ObjectId, id: Types.ObjectId): Promise<void> {
    const data = await this._timeBlockingRepo.findById(id);

    if (!data) throw new ApiError("Schedule not found", HttpStatus.NOT_FOUND);
    if (data.blockType !== BlockType.MECHANIC_BLOCK) throw new ApiError("invalid Operation", HttpStatus.BAD_REQUEST);
    if (data.mechanicId.toString() !== mechanicId.toString()) throw new ApiError("invalid Operation", HttpStatus.BAD_REQUEST);

    await this._timeBlockingRepo.delete(id);
  }








}