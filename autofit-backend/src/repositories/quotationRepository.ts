import { Types } from "mongoose";
import { IQuotationRepository } from "./interfaces/IQuotationRepository";
import { QuotationDocument, QuotationModel } from "../models/quotationModel";
import { BaseRepository } from "./baseRepository";



export class QuotationRepository extends BaseRepository<QuotationDocument> implements IQuotationRepository {

    constructor() {
        super(QuotationModel);
    }

    async findById(id: Types.ObjectId): Promise<QuotationDocument | null> {
        return await QuotationModel.findById(id).exec();
    }

    async findByServiceId(requestId: Types.ObjectId): Promise<QuotationDocument | null> {
        return await QuotationModel.findOne({ requestId }).exec();
    }
    
   
}

