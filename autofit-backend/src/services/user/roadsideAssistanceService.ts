import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";
import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IVehicleRepository } from "../../repositories/interfaces/IVehicleRepository";
import { ApiError } from "../../utils/apiError";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";

export class RoadsideAssistanceService {
  constructor(
    private mechanicProfileRepo: IMechanicProfileRepository,
    private googleMapRepo: IGoogleMapRepository,
    private roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private vehicleRepository: IVehicleRepository,
    private notificationRepository: INotificationRepository
  ) { }

  async getNearByMechanic({ lat, lng }: { lat: number; lng: number }) {
    const mechanics = await this.mechanicProfileRepo.findMechnaicWithRadius({ radius: 10, lat, lng });

    if (!mechanics.length) return [];

    const destinations = mechanics.map((mech) => ({
      lat: mech.location.coordinates[1],
      lng: mech.location.coordinates[0],
    }));

    const { distances, durations } = await this.googleMapRepo.getDistanceMatrix({ lat, lng }, destinations);

    const enriched = mechanics.map((mech, index) => ({
      ...mech,
      distanceInMeters: distances[index],
      durationInSeconds: durations[index],
    }));

    return enriched;
  }

  async createAssistanceRequest({ mechanicId, vehicleId, issue, description, serviceLocation }:
    { mechanicId: Types.ObjectId, vehicleId: Types.ObjectId, issue: string, description: string, serviceLocation: [number, number] }) {


    const vehicle = await this.vehicleRepository.findById(vehicleId)

    if (!vehicle) throw new ApiError('Invalid Vehicle Vehicle Details')

    await this.roadsideAssistanceRepo.create({
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

    const response = await this.notificationRepository.create(
      {
        message: `Emergency - ${vehicle.regNo.toUpperCase()} Requested For RoadSide Assistance.`,
        recipientId: mechanicId,
        recipientType: 'mechanic',
      })

    return { message: response?.message, recipientId: response.recipientId }
  }




}
