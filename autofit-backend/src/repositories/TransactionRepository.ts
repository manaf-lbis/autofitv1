import { TransactionDocument, TransactionModel } from "../models/transactionModel";
import { BaseRepository } from "./baseRepository";
import { ITransactionRepository } from "./interfaces/ITransactionRepository";

export class TransactionRepository extends BaseRepository<TransactionDocument> implements ITransactionRepository{ 
    constructor () {
        super(TransactionModel);
    };

    
}