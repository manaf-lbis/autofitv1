import { Types } from "mongoose";
import { TransactionDocument, TransactionModel } from "../models/transactionModel";
import { BaseRepository } from "./baseRepository";
import { ITransactionRepository } from "./interfaces/ITransactionRepository";
import { DashboardRange } from "../services/admin/interface/IPageService";
import { TransactionStatus } from "../types/transaction";
import { startOfDay, startOfYear, subDays, subYears } from "date-fns";

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

    async durationWiseEarnings(mechanicId: Types.ObjectId, groupStage: any, projectStage: any, sortStage: any, from: Date): Promise<any> {
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


    async transactionDetailsByRange(range: DashboardRange): Promise<any> {
        let startDate: Date;

        switch (range) {
            case DashboardRange.DAY:
                startDate = startOfDay(new Date());
                break;
            case DashboardRange.MONTH:
                startDate = subDays(new Date(), 30);
                break;
            case DashboardRange.YEAR:
                startDate = startOfYear(new Date());
                break;
            default:
                startDate = subYears(new Date(), 5);
        }

        const result = await TransactionModel.aggregate([
            {
                $match: {
                    date: { $gte: startDate },
                    status: TransactionStatus.RECEIVED
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$grossAmount" },
                    deductions: { $sum: "$deductionAmount" },
                    net: { $sum: "$netAmount" }
                }
            },
            {
                $addFields: {
                    paid: "$net"
                }
            },
            {
                $project: {
                    _id: 0,
                    revenue: 1,
                    paid: 1,
                    deductions: 1,
                    net: 1
                }
            }
        ]);

        return result[0] || { revenue: 0, paid: 0, deductions: 0, net: 0 };
    }



}