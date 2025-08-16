import { ObjectId } from "mongodb";

export interface IPayment {
  _id: ObjectId;
  userId: ObjectId;
  serviceId: ObjectId;
  paymentId?: string;
  amount: number;
  method?: string;
  status:  'success' | 'failed' | 'cancelled' | 'pending';
  receipt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PaymentGateway {
  RAZORPAY = "razorpay",
}