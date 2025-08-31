import { Types } from "mongoose";
import { ServiceType } from "../../../types/services";
import { PaymentGateway } from "../../../types/payment";


export interface ICheckoutResponse {
  orderId: Types.ObjectId;
  serviceType: ServiceType;
  vehicleRegNo?: string;
  date: Date
  price: Number
  originalPrice?: Number
} 


export interface ICheckoutService {
  checkoutDetails(serviceId:Types.ObjectId,serviceType:ServiceType):Promise<ICheckoutResponse>;
  createPayment(serviceId:Types.ObjectId,serviceType:ServiceType,gateway:PaymentGateway):Promise<any>;
  verifyPayment(serviceId:Types.ObjectId,serviceType:ServiceType,data?:any):Promise<any>;
}