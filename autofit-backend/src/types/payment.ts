import { ObjectId } from "mongodb";

export interface Payment {
  _id: ObjectId;
  userId: ObjectId;
  serviceId: ObjectId;
  paymentId?: string;
  amount: number;
  method?: string;
  status:  'success' | 'failed' | 'cancelled';
  receipt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
