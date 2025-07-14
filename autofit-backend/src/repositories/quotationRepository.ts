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



// import { Types } from "mongoose";
// import { IQuotationRepository } from "./interfaces/IQuotationRepository";
// import { QuotationDocument, QuotationModel } from "../models/quotationModel";



// export class QuotationRepository  implements IQuotationRepository {

//     async save(entity:Partial<QuotationDocument>): Promise<QuotationDocument> {
//         return await new QuotationModel(entity).save();
//     }

//     async findAll(): Promise<QuotationDocument[] | null> {
//         return await QuotationModel.find().exec();
//     }

//     async findById(id: Types.ObjectId): Promise<QuotationDocument | null> {
//         return await QuotationModel.findById(id).exec();
//     }

//     async update(id: Types.ObjectId, update: Partial<QuotationDocument>): Promise<QuotationDocument | null> {
//         return await QuotationModel.findByIdAndUpdate(id, update, { new: true }).exec();
//     }

//     async delete(id: Types.ObjectId): Promise<void> {
//         await QuotationModel.findByIdAndDelete(id).exec();
//     }

//     async findByServiceId(requestId: Types.ObjectId): Promise<QuotationDocument | null> {
//         return await QuotationModel.findOne({ requestId }).exec();
//     }
    
   
// }