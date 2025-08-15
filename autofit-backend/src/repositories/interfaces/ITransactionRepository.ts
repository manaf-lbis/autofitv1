import { TransactionDocument } from "../../models/transactionModel";
import { IBaseRepository } from "./IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<TransactionDocument> {}
