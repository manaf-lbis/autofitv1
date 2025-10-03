import { Types } from "mongoose";
import { IServicePaymentHandler, PaymentData } from "../interface/IServicePaymentHandler";
import { PaymentVerificationResult } from "../interface/IPaymentGateway";
import { HttpStatus } from "../../../types/responseCode";
import { ApiError } from "../../../utils/apiError";
import { IRoadsideAssistanceRepo } from "../../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IPaymentRepository } from "../../../repositories/interfaces/IPaymentRepository";
import logger from "../../../utils/logger";
import { IQuotationRepository } from "../../../repositories/interfaces/IQuotationRepository";
import { RoadsideAssistanceStatus, RoadsideQuotationStatus } from "../../../types/services";
import { INotificationService } from "../../notifications/INotificationService";

export class RoadsidePaymentHandler implements IServicePaymentHandler {

    constructor(
        private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
        private _paymentRepository: IPaymentRepository,
        private _quotationRepo: IQuotationRepository,
        private _notificationService: INotificationService
    ) { }


    async makeReadyForPayment(serviceId: Types.ObjectId): Promise<PaymentData> {
        const response = await this._roadsideAssistanceRepo.detailedBooking(serviceId);

        if (!response) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND);
        if (response.paymentId?.status === 'success') throw new ApiError('Payment already made', HttpStatus.BAD_REQUEST);

        if (response.paymentId?.createdAt) {
            const createdAt = new Date(response.paymentId?.createdAt);
            const now = new Date();
            const bufferInMs = Number(process.env.PAYMENT_BUFFER || 10) * 60 * 1000;
            const isExpired = now.getTime() - createdAt.getTime() > bufferInMs;

            if (response.paymentId.status === 'pending' && !isExpired) throw new ApiError('Previous Payment is still processing Try after 10 Minutes', HttpStatus.BAD_REQUEST)
        }

        const payment = await this._paymentRepository.createPayment({ serviceId, status: 'pending', userId: response?.userId?._id, amount: response?.quotationId?.total });
        await this._roadsideAssistanceRepo.update(serviceId, {
            paymentId: payment._id,
            status: RoadsideAssistanceStatus.IN_PROGRESS,
            startedAt: new Date()
        });

        return {
            paymentId: payment._id,
            amount: response?.quotationId?.total,
            currency: 'INR',
            email: response?.userId?.email!,
            metadata: {
                serviceId: response._id,
                userId: response?.userId?._id
            },
            mobile: response?.userId?.mobile!,
            name: response?.userId?.name
        }

    }


    async verifyPayment(serviceId: Types.ObjectId, verifiedDetails: PaymentVerificationResult): Promise<any> {

        if (verifiedDetails.status !== 'success') {
            logger.error('payment failed');
            throw new ApiError('Payment Failed', HttpStatus.BAD_REQUEST)
        }

        const service = await this._roadsideAssistanceRepo.findById(serviceId);

        if (!service) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND);
        await this._paymentRepository.update(service?.paymentId!, {
            serviceId,
            paymentId: verifiedDetails.paymentId,
            method: verifiedDetails.method,
            status: 'success',
            receipt: verifiedDetails.receipt

        });

        const response = await this._roadsideAssistanceRepo.findById(serviceId);
        if (!response?.quotationId) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND);
        await this._quotationRepo.update(response?.quotationId, { status: RoadsideQuotationStatus.APPROVED });

        await this._notificationService.sendNotification({
            recipientId: response?.userId!._id,
            message: `Quotation approved and payment Completed Continue with the service.`,
            recipientType: 'mechanic'
        })

    }



} 