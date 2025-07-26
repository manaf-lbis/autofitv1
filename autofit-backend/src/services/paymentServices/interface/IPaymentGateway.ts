import { PaymentGateway } from "../../../types/payment";
import { PaymentData } from "./IServicePaymentHandler";


interface FailedPaymentVerification {
  status: 'failed';
  gateway: string;
}
interface SuccessfulPaymentVerification {
  amount: number;
  paymentId: string;
  status: string;
  method: string; 
  userId: string;
  serviceId: string;
  receipt: string;
}

export type PaymentVerificationResult = FailedPaymentVerification | SuccessfulPaymentVerification;

export interface IPaymentGateway {
  createPayment(data: PaymentData): Promise<{orderId: string,amountInRupees: number, serviceId?:string,gateway?:PaymentGateway}>;
  verifyPayment(data: any): Promise<PaymentVerificationResult>;
}