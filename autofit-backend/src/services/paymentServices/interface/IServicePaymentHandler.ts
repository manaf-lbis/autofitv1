import { Types } from "mongoose";
import { PaymentVerificationResult } from "./IPaymentGateway";



export interface PaymentData {
  paymentId:Types.ObjectId
  name: string,
  email: string,
  mobile: string,
  amount: number,
  currency: string,
  metadata: {
    userId: string,
    serviceId: string,
  }
}


export interface IServicePaymentHandler {
  makeReadyForPayment(serviceId: Types.ObjectId): Promise<PaymentData>;
  verifyPayment(serviceId: Types.ObjectId, verifiedDetails: PaymentVerificationResult): Promise<any>;
}


