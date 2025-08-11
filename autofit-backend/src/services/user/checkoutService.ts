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

export class CheckoutService implements ICheckoutService {

    constructor(
        private _pretripBookingRepository: IPretripBookingRepository,
        private _paymentGatewayResolver: IPaymentGatewayResolver,
        private _servicePaymentHanleResolver: IServicePaymentHandleResolver,
        private _paymentRepository: IPaymentRepository
    ) { }

    async checkoutDetails(serviceId: Types.ObjectId, serviceType: ServiceType): Promise<ICheckoutResponse> {

        if (serviceType === ServiceType.PRETRIP) {
            const response = await this._pretripBookingRepository.checkoutDetails(serviceId);

            if (!response) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND)
            return {
                date: response.createdAt,
                price: response.servicePlan?.price,
                orderId: response._id,
                serviceType: ServiceType.PRETRIP,
                vehicleRegNo: response.vehicleId?.regNo,
                originalPrice: response.servicePlan?.originalPrice
            }
        } else {
            // reserved for roadside assistance
            const response = await this._pretripBookingRepository.checkoutDetails(serviceId);
            if (!response) throw new ApiError('Booking not found', HttpStatus.NOT_FOUND)
            return {
                date: response.createdAt,
                price: response.servicePlan?.price,
                orderId: response._id,
                serviceType: ServiceType.PRETRIP,
                vehicleRegNo: response.vehicleId.regNo,
                originalPrice: response.servicePlan.originalPrice
            }
        }

    };

    async createPayment(serviceId: Types.ObjectId, serviceType: ServiceType, gateway: PaymentGateway): Promise<any> {

        const paymentGateway = this._paymentGatewayResolver.resolve(gateway);
        const paymentHandler = this._servicePaymentHanleResolver.resolve(serviceType);

        const paymentInfo = await paymentHandler.makeReadyForPayment(serviceId);
        const response = await paymentGateway.createPayment(paymentInfo);

        const payment = await this._paymentRepository.update(paymentInfo.paymentId,{paymentId:response.orderId})  

        if(!payment) throw new ApiError('Payment creation failed', HttpStatus.BAD_REQUEST)

        response.gateway = gateway;
        response.serviceId = serviceId.toString();
        return response
 
    }

    async verifyPayment(serviceId: Types.ObjectId, serviceType: ServiceType, data?: any): Promise<any> {
        const paymentGateway = this._paymentGatewayResolver.resolve(data.gateway);
        const verifiedDetails = await paymentGateway.verifyPayment(data);

        const servicePaymetnHandler = this._servicePaymentHanleResolver.resolve(serviceType);
        await servicePaymetnHandler.verifyPayment(serviceId, verifiedDetails);

        if(verifiedDetails.status !== 'success') throw new ApiError('Payment Failed', HttpStatus.BAD_REQUEST)

        return {serviceId,status:verifiedDetails.status,amount:verifiedDetails.amount}
    }


}

