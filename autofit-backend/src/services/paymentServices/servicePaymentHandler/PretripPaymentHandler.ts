import { Types } from "mongoose";
import { IPretripBookingRepository } from "../../../repositories/interfaces/IPretripBookingRepository";
import { IServicePaymentHandler, PaymentData } from "../interface/IServicePaymentHandler";
import { PaymentStatus, SlotStatus } from "../../../types/pretrip";
import { ApiError } from "../../../utils/apiError";
import { HttpStatus } from "../../../types/responseCode";
import { PaymentVerificationResult } from "../interface/IPaymentGateway";
import { IPaymentRepository } from "../../../repositories/interfaces/IPaymentRepository";
import { IPretripSlotRepository } from "../../../repositories/interfaces/IPretripSlotRepository";

export class PretripPaymentHandler implements IServicePaymentHandler {
  constructor(
    private _pretripBookingRepo: IPretripBookingRepository,
    private _paymentRepository: IPaymentRepository,
    private _slotRepository: IPretripSlotRepository
  ) { }


  async makeReadyForPayment(serviceId: Types.ObjectId): Promise<PaymentData> {
    const response = await this._pretripBookingRepo.detailedBooking(serviceId);
    if (!response) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND)
    if(response.payment.status === PaymentStatus.PAID) throw new ApiError('Payment already made', HttpStatus.BAD_REQUEST)
    const createdAt = new Date(response.payment.paymentId.createdAt);
    
    const now = new Date();
    const tenMinutesInMs = 10 * 60 * 1000;
    const isExpired = now.getTime() - createdAt.getTime() > tenMinutesInMs;
  
    if(response.payment.paymentId.status === 'pending' && !isExpired ) throw new ApiError('Previous Payment is still processing Try after 10 Minutes', HttpStatus.BAD_REQUEST) 
      
    const payment = await this._paymentRepository.createPayment({serviceId, status:'pending',userId:response.userId._id, amount:response?.servicePlan?.price})
    await this._pretripBookingRepo.update(serviceId, { payment: { status: PaymentStatus.PENDING,paymentId:payment._id } });

    return {
      paymentId:payment._id,
      amount: response?.servicePlan?.price,
      currency: 'INR',
      email: response?.userId.email!,
      metadata: {
        serviceId: response._id,
        userId: response.userId._id
      },
      mobile: response?.userId.mobile!,
      name: response?.userId.name!,
    }
  };

  async verifyPayment(serviceId: Types.ObjectId,verificationDetails:PaymentVerificationResult): Promise<any> {

    if(verificationDetails.status !== 'success') {
      const booking =await this._pretripBookingRepo.update(serviceId, { payment: { status: PaymentStatus.FAILED } });
      await this._paymentRepository.updatePayemtStatus({serviceId, status: 'failed'});
      await this._slotRepository.update(booking?.slotId!,{status:SlotStatus.AVAILABLE})
      throw new ApiError('Payment verification failed', HttpStatus.BAD_REQUEST)
    }

    const booking = await this._pretripBookingRepo.update(serviceId, { payment: { status: PaymentStatus.PAID} });
    await this._slotRepository.update(booking?.slotId!,{status:SlotStatus.BOOKED})
    return await this._paymentRepository.updatePayemtStatus({
      serviceId,
       status:'success',
       paymentId:verificationDetails.paymentId,
       receipt:verificationDetails.receipt,
       amount:verificationDetails.amount,
       method:verificationDetails.method,
    });
  }




}


