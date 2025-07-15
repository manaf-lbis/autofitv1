import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";
import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IVehicleRepository } from "../../repositories/interfaces/IVehicleRepository";
import { ApiError } from "../../utils/apiError";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IPaymentGateayRepository } from "../../repositories/interfaces/IPaymentGateayRepository";
import { IQuotationRepository } from "../../repositories/interfaces/IQuotationRepository";
import { IPaymentRepository } from "../../repositories/interfaces/IPaymentRepository";
import { IUserRoadsideService } from "./interface/IUserRoadsideService";

export class UserRoadsideService implements IUserRoadsideService {
  constructor(
    private _mechanicProfileRepo: IMechanicProfileRepository,
    private _googleMapRepo: IGoogleMapRepository,
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _vehicleRepository: IVehicleRepository,
    private _notificationRepository: INotificationRepository,
    private _razorpayRepository: IPaymentGateayRepository,
    private _quotaionRepo: IQuotationRepository,
    private _paymentRepo: IPaymentRepository
  ) { }

  async getNearByMechanic({ lat, lng }: { lat: number; lng: number }) {
    const mechanics = await this._mechanicProfileRepo.findMechnaicWithRadius({ radius: 10, lat, lng });

    if (!mechanics.length) return [];

    const destinations = mechanics.map((mech) => ({
      lat: mech.location.coordinates[1],
      lng: mech.location.coordinates[0],
    }));

    const { distances, durations } = await this._googleMapRepo.getDistanceMatrix({ lat, lng }, destinations);

    const enriched = mechanics.map((mech, index) => ({
      ...mech,
      distanceInMeters: distances[index],
      durationInSeconds: durations[index],
    }));

    return enriched;
  }

  async createAssistanceRequest({ mechanicId, vehicleId, issue, description, serviceLocation }:
    { mechanicId: Types.ObjectId, vehicleId: Types.ObjectId, issue: string, description: string, serviceLocation: [number, number] }) {


    const vehicle = await this._vehicleRepository.findById(vehicleId)

    if (!vehicle) throw new ApiError('Invalid Vehicle Vehicle Details')

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

    await this._mechanicProfileRepo.update(mechanicId, { availability: 'busy' })

    const notification = await this._notificationRepository.save(
      {
        message: `Emergency - ${vehicle.regNo.toUpperCase()} Requested For RoadSide Assistance.`,
        recipientId: mechanicId,
        recipientType: 'mechanic',
      })

    return { notification, emergencyAssistance }
  }

  async approveQuoteAndPay({ serviceId, quotationId ,userId }: { serviceId: Types.ObjectId, quotationId: Types.ObjectId,userId:Types.ObjectId }) {

    const service = await this._roadsideAssistanceRepo.findById(serviceId);
    const quotation = await this._quotaionRepo.findById(quotationId);
    const payment = await this._paymentRepo.veryfyPaymentStatus(serviceId.toString());

    if(payment?.status === 'success') throw new ApiError('Payment Already Done')

    if (payment?.createdAt) {
      const createdAt = new Date(payment.createdAt).getTime();
      const expiry = createdAt + 10 * 60 * 1000;
      const now = Date.now();

      if (now < expiry) {
        throw new ApiError(`Previous payment is still processing. Try after 10 Minutes`);
      }else{
        await this._paymentRepo.deletePayment(serviceId.toString())
      }
    }

    if (!quotation) throw new ApiError('Quotation Not Generated')

    if (!service?.quotationId?._id.equals(quotation._id)) throw new ApiError('Quotation Not Match With Service')

    const { orderId } = await this._razorpayRepository.createOrder(quotation.total, serviceId.toString());

    await this._paymentRepo.createPayment({
      userId : userId,
      serviceId,
      paymentId: '',
      amount: quotation.total,
      method: 'razorpay',
      status: 'pending',
      receipt: orderId
    })

    

    return { orderId, mechanicId: service.mechanicId }
  }


  async VerifyPaymentAndApprove({ paymentId, orderId, signature, userId }: { paymentId: string, orderId: string, signature: string, userId: Types.ObjectId }) {
    await this._razorpayRepository.verifyPayment(paymentId, orderId, signature)

    const order = await this._razorpayRepository.payloadFromOrderId(orderId)
    const payment = await this._razorpayRepository.payloadFromPaymentId(paymentId)

    const paymentDoc = await this._paymentRepo.updatePayemtStatus({
      userId,
      serviceId: order.notes.serviceId,
      paymentId: payment.id,
      method: payment.method,
      status: "success",
      receipt: order.receipt
    });

    if(!paymentDoc) throw new ApiError('Invalid Payment')

    const response = await this._roadsideAssistanceRepo.update(order.notes.serviceId, { status: 'in_progress', startedAt: new Date(), paymentId: paymentDoc._id })
    if (!response?.quotationId) throw new ApiError('Invalid Service')
    await this._quotaionRepo.update(response.quotationId, { status: 'approved' })
    return { mechanicId: response.mechanicId }

  }

}
