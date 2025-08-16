import { Types } from "mongoose";
import { TransactionDocument, TransactionModel } from "../models/transactionModel";
import { BaseRepository } from "./baseRepository";
import { ITransactionRepository } from "./interfaces/ITransactionRepository";

export class TransactionRepository extends BaseRepository<TransactionDocument> implements ITransactionRepository {
    constructor() {
        super(TransactionModel);
    };

    async earnings(mechanicId: Types.ObjectId, from: Date): Promise<any> {

        return await TransactionModel.aggregate([
            { $match: { mechanicId, createdAt: { $gte: from } } },
            {
                $group: {
                    _id: '$serviceType',
                    value: {
                        $sum: '$grossAmount'
                    },
                    net: {
                        $sum: '$netAmount'
                    }
                }
            }
        ]);
    }

    async durationWiseEarnings(mechanicId: Types.ObjectId, groupStage: any, projectStage: any, sortStage: any,from:Date): Promise<any> {
        return await TransactionModel.aggregate([
            { $match: { mechanicId, createdAt: { $gte: from } } },
            { $group: groupStage },
            { $project: projectStage },
            { $sort: sortStage }
        ]);

    }

    async recentTransactions(mechanicId: Types.ObjectId): Promise<TransactionDocument[]> {
        return await TransactionModel.find({ mechanicId }).sort({ createdAt: -1 }).limit(20)
        .select('-_id serviceType netAmount grossAmount description deductionAmount deductionRate status date transactionId');
    }






}