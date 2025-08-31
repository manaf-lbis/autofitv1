import { Types } from "mongoose";
import { IPretripBookingRepository } from "../../../repositories/interfaces/IPretripBookingRepository";
import { IServicePaymentHandler, PaymentData } from "../interface/IServicePaymentHandler";
import { PaymentStatus } from "../../../types/pretrip";
import { ApiError } from "../../../utils/apiError";
import { HttpStatus } from "../../../types/responseCode";
import { PaymentVerificationResult } from "../interface/IPaymentGateway";
import { IPaymentRepository } from "../../../repositories/interfaces/IPaymentRepository";
import { ITimeBlockRepository } from "../../../repositories/interfaces/ITimeBlockRepository";
import { BlockType } from "../../../models/timeBlock";


export class PretripPaymentHandler implements IServicePaymentHandler {
  constructor(
    private _pretripBookingRepo: IPretripBookingRepository,
    private _paymentRepository: IPaymentRepository,
    private _timeBlockRepo : ITimeBlockRepository
  ) { }


  async makeReadyForPayment(serviceId: Types.ObjectId): Promise<PaymentData> {
    const response = await this._pretripBookingRepo.detailedBooking(serviceId);
    if (!response) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND)
    if (response.payment.status === PaymentStatus.PAID) throw new ApiError('Payment already made', HttpStatus.BAD_REQUEST);


    if (response.payment?.paymentId?.createdAt) {
      const createdAt = new Date(response.payment?.paymentId?.createdAt);

      const now = new Date();
      const bufferInMs = Number(process.env.PAYMENT_BUFFER || 10) * 60 * 1000;
      const isExpired = now.getTime() - createdAt.getTime() > bufferInMs;

      if (response.payment.paymentId.status === 'pending' && !isExpired) throw new ApiError('Previous Payment is still processing Try after 10 Minutes', HttpStatus.BAD_REQUEST)
    }


    const payment = await this._paymentRepository.createPayment({ serviceId, status: 'pending', userId: response.userId._id, amount: response?.serviceReportId?.servicePlan?.price })
    await this._pretripBookingRepo.update(serviceId, { payment: { status: PaymentStatus.PENDING, paymentId: payment._id } });

    return {
      paymentId: payment._id,
      amount: response?.serviceReportId?.servicePlan?.price,
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

  async verifyPayment(serviceId: Types.ObjectId, verificationDetails: PaymentVerificationResult): Promise<any> {

    if (verificationDetails.status !== 'success') {
      console.log('Payment failed');
    } else {

      await this._paymentRepository.updatePayemtStatus({
        serviceId,
        paymentId: verificationDetails.paymentId,
        method: verificationDetails.method,
        status: 'success',
        receipt: verificationDetails.receipt
      });

      const response = await this._pretripBookingRepo.updatePaymentStatus(
        serviceId,
        PaymentStatus.PAID
      );

      if(!response) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND);
      await this._timeBlockRepo.update(response.blockedTimeId, {blockType: BlockType.USER_BOOKING});

    }
  }




}


