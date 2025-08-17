import { Types } from "mongoose";
import { ICheckoutResponse, ICheckoutService } from "./Interface/ICheckoutService";
import { ServiceType } from "../../types/services";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { IPaymentGatewayResolver } from "../paymentServices/interface/IPaymentGatewayResolver";
import { IServicePaymentHandleResolver } from "../paymentServices/interface/IServicePaymentHandleResolver";
import { PaymentGateway } from "../../types/payment";
import { IPaymentRepository } from "../../repositories/interfaces/IPaymentRepository";
import { ILiveAssistanceRepository } from "../../repositories/interfaces/ILiveAssistanceRepository";

export class CheckoutService implements ICheckoutService {

    constructor(
        private _pretripBookingRepository: IPretripBookingRepository,
        private _paymentGatewayResolver: IPaymentGatewayResolver,
        private _servicePaymentHanleResolver: IServicePaymentHandleResolver,
        private _paymentRepository: IPaymentRepository,
        private _liveAssistanceRepository: ILiveAssistanceRepository
    ) { }

    async checkoutDetails(serviceId: Types.ObjectId, serviceType: ServiceType): Promise<ICheckoutResponse> {

        if (serviceType === ServiceType.PRETRIP) {
            const response = await this._pretripBookingRepository.checkoutDetails(serviceId);

            if (!response) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND)
            return {
                date: response.createdAt,
                price: response?.serviceReportId?.servicePlan?.price,
                orderId: response._id,
                serviceType: ServiceType.PRETRIP,
                vehicleRegNo: response.vehicleId?.regNo,
                originalPrice: response.servicePlan?.originalPrice
            }
        } else if (serviceType === ServiceType.LIVE) {

            const response = await this._liveAssistanceRepository.checkoutDetails(serviceId);

            const createdAt = new Date(response.createdAt);
            const now = new Date();
            const bufferInMs = Number(process.env.PAYMENT_BUFFER || 10) * 60 * 1000;
            const isExpired = now.getTime() - createdAt.getTime() > bufferInMs;

            if (isExpired) throw new ApiError('Request Expired Try With New Request', HttpStatus.BAD_REQUEST)

            return {
                date: response.createdAt,
                price: response.price,
                orderId: response._id,
                serviceType: ServiceType.LIVE,
            }

        } else {
            throw new ApiError('Invalid Service Type', HttpStatus.BAD_REQUEST)
        }

    };

    async createPayment(serviceId: Types.ObjectId, serviceType: ServiceType, gateway: PaymentGateway): Promise<any> {

        const paymentGateway = this._paymentGatewayResolver.resolve(gateway);
        const paymentHandler = this._servicePaymentHanleResolver.resolve(serviceType);

        const paymentInfo = await paymentHandler.makeReadyForPayment(serviceId);
        const response = await paymentGateway.createPayment(paymentInfo);

        const payment = await this._paymentRepository.update(paymentInfo.paymentId, { paymentId: response.orderId })

        if (!payment) throw new ApiError('Payment creation failed', HttpStatus.BAD_REQUEST)

        response.gateway = gateway;
        response.serviceId = serviceId.toString();
        return response

    }

    async verifyPayment(serviceId: Types.ObjectId, serviceType: ServiceType, data?: any): Promise<any> {
        const paymentGateway = this._paymentGatewayResolver.resolve(data.gateway);
        const verifiedDetails = await paymentGateway.verifyPayment(data);

        const servicePaymetnHandler = this._servicePaymentHanleResolver.resolve(serviceType);
        await servicePaymetnHandler.verifyPayment(serviceId, verifiedDetails);

        if (verifiedDetails.status !== 'success') throw new ApiError('Payment Failed', HttpStatus.BAD_REQUEST)

        return { serviceId, status: verifiedDetails.status, amount: verifiedDetails.amount }
    }


}

