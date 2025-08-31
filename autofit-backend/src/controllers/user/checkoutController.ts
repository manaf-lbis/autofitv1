import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { ICheckoutService } from "../../services/user/Interface/ICheckoutService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { Types } from "mongoose";
import { PaymentGateway } from "../../types/payment";

export enum ServiceType {
    ROADSIDE = 'roadside',
    PRETRIP = 'pretrip',
    LIVE = 'liveAssistance',
}

export class CheckoutController {

    constructor(
        private _checkoutService : ICheckoutService,
    ) { }


    async checkoutDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { service_type, id } = req.params;
            if(!service_type || !id) throw new ApiError('Invalid Parameter',HttpStatus.BAD_REQUEST)
            
            if(!Object.values(ServiceType).includes(service_type as ServiceType)){
              throw new ApiError('Invalid Service Type',HttpStatus.BAD_REQUEST)  
            } 
                     
            const response = await this._checkoutService.checkoutDetails(new Types.ObjectId(id), service_type as ServiceType);
 
            sendSuccess(res, 'Success', response);

        } catch (error) {
            next(error)
        }
    }

    async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { service_type, id } = req.params;
            const {gateway} = req.body
            if(!service_type || !id) throw new ApiError('Invalid Parameter',HttpStatus.BAD_REQUEST);

            const services = Object.values(ServiceType)
            if(!services.includes(service_type as ServiceType)) throw new ApiError('Invalid Service Type',HttpStatus.BAD_REQUEST);

            const gateways = Object.values(PaymentGateway)
            if(!gateways.includes(gateway as PaymentGateway)) throw new ApiError('Invalid Payment Gateway',HttpStatus.BAD_REQUEST);

           const paymentResponse = await this._checkoutService.createPayment(new Types.ObjectId(id), service_type as ServiceType, gateway);

            sendSuccess(res, 'Success', paymentResponse);

        } catch (error) {
            next(error)
        }
    }

    async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { service_type, id } = req.params;
            const {gateway} = req.body
            
            if(!service_type || !id) throw new ApiError('Invalid Parameter',HttpStatus.BAD_REQUEST);    

            const services = Object.values(ServiceType)
            if(!services.includes(service_type as ServiceType)) throw new ApiError('Invalid Service Type',HttpStatus.BAD_REQUEST);

            const gateways = Object.values(PaymentGateway)
            if(!gateways.includes(gateway as PaymentGateway)) throw new ApiError('Invalid Payment Gateway',HttpStatus.BAD_REQUEST);

            const paymentResponse = await this._checkoutService.verifyPayment(new Types.ObjectId(id), service_type as ServiceType, req.body);

            sendSuccess(res, 'Payment Success', paymentResponse);

        } catch (error) {
            next(error)
        }
    }





}