import { Types } from "mongoose";
import { ServiceType } from "./services";

export enum TransactionStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  FAILED = 'failed'
} 

export interface Transaction {
  _id: Types.ObjectId;
  mechanicId: Types.ObjectId;
  userId: Types.ObjectId;
  paymentId : Types.ObjectId;
  serviceType: ServiceType;
  serviceId: Types.ObjectId;
  grossAmount: number;
  deductionRate: number;
  deductionAmount: number;
  netAmount: number; 
  date: Date;
  status: TransactionStatus;
  transactionId: string; 
  description: string;
}

export enum TransactionDurations {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  CUSTOM = "custom",
}