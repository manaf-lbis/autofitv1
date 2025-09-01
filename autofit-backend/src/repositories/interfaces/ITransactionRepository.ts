import { Types } from "mongoose";
import { TransactionDocument } from "../../models/transactionModel";
import { IBaseRepository } from "./IBaseRepository";
import { DashboardRange } from "../../services/admin/interface/IPageService";

export interface ITransactionRepository extends IBaseRepository<TransactionDocument> {
    earnings(mechanicId: Types.ObjectId, from: Date): Promise<any>
    durationWiseEarnings(mechanicId: Types.ObjectId, groupStage:any, projectStage:any, sortStage:any ,from:Date): Promise<any>
    recentTransactions(mechanicId: Types.ObjectId): Promise<TransactionDocument[]>
    transactionDetailsByRange(range: DashboardRange): Promise<any>
}
