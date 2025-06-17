export interface IPaymentGateayRepository {
  createOrder(amount: number,serviceId:string): Promise<{ orderId: string }>;
  verifyPayment(paymentId: string, orderId: string, signature: string): boolean;
  payloadFromOrderId(orderId:string):any
  payloadFromPaymentId(paymentId:string):any
}