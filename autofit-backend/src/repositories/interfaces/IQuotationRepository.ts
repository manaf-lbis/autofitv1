import { Types } from "mongoose";
import { QuotationDocument } from "../../models/quotationModel";
import { IBaseRepository } from "./IBaseRepository";

export interface IQuotationRepository extends IBaseRepository<QuotationDocument> { 

    findByServiceId(requestId: Types.ObjectId): Promise<QuotationDocument | null>;



}