import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";
import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IVehicleRepository } from "../../repositories/interfaces/IVehicleRepository";
import { ApiError } from "../../utils/apiError";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IPaymentRepository } from "../../repositories/interfaces/IPaymentRepository";
import { IQuotationRepository } from "../../repositories/interfaces/IQuotationRepository";

export class UserRoadsideService {
  constructor(
    private mechanicProfileRepo: IMechanicProfileRepository,
    private googleMapRepo: IGoogleMapRepository,
    private roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private vehicleRepository: IVehicleRepository,
    private notificationRepository: INotificationRepository,
    private razorpayRepository:IPaymentRepository,
    private quotaionRepo : IQuotationRepository
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

    const emergencyAssistance = await this.roadsideAssistanceRepo.create({
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

    await this.mechanicProfileRepo.update(mechanicId, { availability: 'busy' })

    const notification = await this.notificationRepository.create(
      {
        message: `Emergency - ${vehicle.regNo.toUpperCase()} Requested For RoadSide Assistance.`,
        recipientId: mechanicId,
        recipientType: 'mechanic',
      })

    return { notification, emergencyAssistance }
  }

  async approveQuoteAndPay({serviceId,quotationId}:{serviceId:Types.ObjectId,quotationId:Types.ObjectId}){

    const service = await this.roadsideAssistanceRepo.findById(serviceId)
    const quotation = await this.quotaionRepo.findById(quotationId)
    if(!quotation) throw new ApiError('Quotation Not Generated')

    if(!service?.quotationId?._id.equals(quotation._id)) throw new ApiError('Quotation Not Match With Service')

    return await this.razorpayRepository.createOrder(quotation.total)
    
  }



}
