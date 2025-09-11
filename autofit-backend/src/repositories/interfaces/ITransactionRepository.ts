import { Types } from "mongoose";
import { TransactionDocument } from "../../models/transactionModel";
import { IBaseRepository } from "./IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<TransactionDocument> {
    earnings(mechanicId: Types.ObjectId, from: Date, to?: Date): Promise<any>
    durationWiseEarnings(mechanicId: Types.ObjectId, groupStage: any, projectStage: any, sortStage: any, from: Date, to?: Date): Promise<any>
    recentTransactions(mechanicId: Types.ObjectId, from?: Date, to?: Date): Promise<TransactionDocument[]>
    transactionDetails(start: Date, end: Date): Promise<any>
}