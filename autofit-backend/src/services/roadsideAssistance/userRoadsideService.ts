import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";
import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IVehicleRepository } from "../../repositories/interfaces/IVehicleRepository";
import { ApiError } from "../../utils/apiError";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IUserRoadsideService } from "./interface/IUserRoadsideService";
import { Role } from "../../types/role";
import logger from "../../utils/logger";
import { ITimeBlockRepository } from "../../repositories/interfaces/ITimeBlockRepository";
import { differenceInMinutes, startOfDay } from "date-fns";
import { HttpStatus } from "../../types/responseCode";
import { MechanicAvailabilityStatus } from "../../types/mechanic/mechanic";
import { IRatingRepository } from "../../repositories/interfaces/IRatingRepository";

export class UserRoadsideService implements IUserRoadsideService {
  constructor(
    private _mechanicProfileRepo: IMechanicProfileRepository,
    private _googleMapRepo: IGoogleMapRepository,
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _vehicleRepository: IVehicleRepository,
    private _notificationRepository: INotificationRepository,
    private _timeBlockingRepo: ITimeBlockRepository,
    private _ratingRepo: IRatingRepository
  ) { }

  async getNearByMechanic({ lat, lng }: { lat: number; lng: number }) {
    const mechanics = await this._mechanicProfileRepo.findMechnaicWithRadius({ radius: 10, lat, lng });

    if (!mechanics.length) return [];

    const destinations = mechanics.map((mech) => ({
      lat: mech.location.coordinates[1],
      lng: mech.location.coordinates[0],
    }));

    const { distances, durations } = await this._googleMapRepo.getDistanceMatrix({ lat, lng }, destinations);
    const mechanicIds = mechanics.map((mechanic) => mechanic.mechanicId);

    const ratings = await this._ratingRepo.avgRatingOfMechanics(mechanicIds);

    const enriched = mechanics.map((mech, index) => ({
      ...mech,
      rating: ratings[index],
      distanceInMeters: distances[index],
      durationInSeconds: durations[index],
    }));

    return enriched;
  }

  async createAssistanceRequest({ mechanicId, vehicleId, issue, description, serviceLocation }:
    { mechanicId: Types.ObjectId, vehicleId: Types.ObjectId, issue: string, description: string, serviceLocation: [number, number] }) {


    const vehicle = await this._vehicleRepository.findById(vehicleId)
    if (!vehicle) throw new ApiError('Invalid Vehicle Vehicle Details')

    const now = new Date();
    const start = startOfDay(now);
    const currentMinutes = differenceInMinutes(now, start);
    const blockings = await this._timeBlockingRepo.timeBlockByTimeRange(mechanicId, currentMinutes, currentMinutes + 30, now)

    if (blockings) throw new ApiError('Sorry Selected Mechnaic is busy', HttpStatus.BAD_REQUEST)


    const emergencyAssistance = await this._roadsideAssistanceRepo.create({
      mechanicId,
      vehicle: {
        regNo: vehicle.regNo,
        brand: vehicle.brand,
        modelName: vehicle.modelName,
        owner: vehicle.owner,
      },
      userId: vehicle.userId,
      issue,
      description,
      serviceLocation: {
        type: 'Point',
        coordinates: serviceLocation
      },
    })

    await this._mechanicProfileRepo.update(mechanicId, { availability: MechanicAvailabilityStatus.BUSY })

    const notification = await this._notificationRepository.save({
      message: `Emergency - ${vehicle.regNo.toUpperCase()} Requested For RoadSide Assistance.`,
      recipientId: mechanicId,
      recipientType: Role.MECHANIC,
    })

    logger.info(`Emergency - ${vehicle.regNo.toUpperCase()} Requested For RoadSide Assistance.`)

    return { notification, emergencyAssistance }
  }






}
