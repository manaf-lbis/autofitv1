import { Types } from "mongoose";
import { IServicePaymentHandler, PaymentData } from "../interface/IServicePaymentHandler";
import { PaymentVerificationResult } from "../interface/IPaymentGateway";
import { ILiveAssistanceRepository } from "../../../repositories/interfaces/ILiveAssistanceRepository";
import { ApiError } from "../../../utils/apiError";
import { HttpStatus } from "../../../types/responseCode";
import { LiveAssistanceStatus } from "../../../types/liveAssistance";
import { IPaymentRepository } from "../../../repositories/interfaces/IPaymentRepository";
import { ITimeBlockRepository } from "../../../repositories/interfaces/ITimeBlockRepository";
import { BlockType } from "../../../models/timeBlock";
import { ITransactionRepository } from "../../../repositories/interfaces/ITransactionRepository";
import { TransactionStatus } from "../../../types/transaction";
import { generateTransactionId, getDeductionRate } from "../../../utils/transactionUtils";
import { ServiceType } from "../../../types/services";
import { INotificationService } from "../../notifications/INotificationService";

export class LiveAssistancePaymentHandler implements IServicePaymentHandler {

    constructor(
        private _liveAssistanceRepository: ILiveAssistanceRepository,
        private _paymentRepository: IPaymentRepository,
        private _timeBlockingRepo: ITimeBlockRepository,
        private _transactionRepo: ITransactionRepository,
        private _notificationService: INotificationService
    ) { }

    async makeReadyForPayment(serviceId: Types.ObjectId): Promise<PaymentData> {
        const detailedBooking = await this._liveAssistanceRepository.detailedBooking(serviceId);
        if (!detailedBooking) throw new Error('Booking not found');

        if (detailedBooking?.paymentId?.status === 'paid') throw new Error('Payment already made');

        const createdAt = new Date(detailedBooking.createdAt);
        const now = new Date();
        const bufferInMs = Number(process.env.PAYMENT_BUFFER || 10) * 60 * 1000;
        const isExpired = now.getTime() - createdAt.getTime() > bufferInMs;

        if (isExpired) throw new ApiError('Request Expired Try With New Request', HttpStatus.BAD_REQUEST)

        if (detailedBooking.paymentId?.createdAt) {
            const createdAt = new Date(detailedBooking.paymentId?.createdAt);
            const now = new Date();
            const bufferInMs = Number(process.env.PAYMENT_BUFFER || 10) * 60 * 1000;
            const isExpired = now.getTime() - createdAt.getTime() > bufferInMs;

            if (isExpired) {
                await this._liveAssistanceRepository.update(serviceId, { status: LiveAssistanceStatus.TIMEOUT });
                throw new ApiError('Attempt already Exhausted, Try New Booking', HttpStatus.BAD_REQUEST)
            }

            if (detailedBooking?.paymentId.status === 'pending' && !isExpired) throw new ApiError('Previous Payment is still processing Try after 10 Minutes', HttpStatus.BAD_REQUEST)
        };

        const payment = await this._paymentRepository.createPayment({
            serviceId,
            status: 'pending',
            userId: detailedBooking.userId._id,
            amount: detailedBooking?.price
        })

        await this._liveAssistanceRepository.update(serviceId, { paymentId: payment._id });

        return {
            amount: detailedBooking?.price,
            currency: 'INR',
            email: detailedBooking?.userId.email!,
            metadata: {
                serviceId: serviceId.toString(),
                userId: detailedBooking.userId._id
            },
            mobile: detailedBooking?.userId.mobile!,
            paymentId: payment._id,
            name: detailedBooking?.userId.name
        }

    }
    async verifyPayment(serviceId: Types.ObjectId, verifiedDetails: PaymentVerificationResult): Promise<any> {

        if (verifiedDetails.status !== 'success') throw new ApiError('Payment Failed Try Again', HttpStatus.BAD_REQUEST);
        const deductionRate = getDeductionRate(ServiceType.LIVE);

        const paymentDetais = await this._paymentRepository.updatePayemtStatus({
            serviceId: serviceId,
            paymentId: verifiedDetails.paymentId,
            method: verifiedDetails.method,
            status: 'success',
            receipt: verifiedDetails.receipt
        });

        if (!paymentDetais) throw new ApiError('Invalid Payment', HttpStatus.BAD_REQUEST)
        const response = await this._liveAssistanceRepository.update(serviceId, { status: LiveAssistanceStatus.ONGOING });
        if (!response) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST)

        await this._transactionRepo.save({
            serviceId: serviceId,
            mechanicId: response?.mechanicId,
            status: TransactionStatus.RECEIVED,
            deductionAmount: (deductionRate * paymentDetais?.amount) / 100,
            deductionRate: deductionRate,
            grossAmount: paymentDetais?.amount,
            netAmount: paymentDetais?.amount - (deductionRate * paymentDetais?.amount) / 100,
            description: 'Pretrip Checkup',
            transactionId: generateTransactionId(ServiceType.PRETRIP),
            paymentId: paymentDetais._id,
            userId: response.userId,
            serviceType: ServiceType.PRETRIP,
        })

        if (!response) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST)

        await this._notificationService.sendNotification({
            recipientId: response?.mechanicId,
            message: 'You have been assigned a Live Assistance request',
            recipientType: 'mechanic'
        })

        await this._timeBlockingRepo.update(response?.blockedTimeId, { blockType: BlockType.USER_BOOKING });
    }


}