export interface IPaymentRepository {
  createOrder(amount: number): Promise<{ orderId: string }>;
  verifyPayment(paymentId: string, orderId: string, signature: string): boolean;
}