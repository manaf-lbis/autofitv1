import { Types } from "mongoose";
import { RoadsideAssistanceDocument } from "../../../models/roadsideAssistanceModel";
import { QuotationDocument } from "../../../models/quotationModel";

interface PagenationInfo{
  totalDocuments: number,
  hasMore: boolean
}

export interface LiveAssistanceHistoryResponse extends PagenationInfo{
  history: RoadsideAssistanceDocument[]
}



export interface IRoadsideService {

  serviceDetails(serviceId: Types.ObjectId): Promise<RoadsideAssistanceDocument | null>;
  updateStatus(userId: Types.ObjectId, serviceId: Types.ObjectId, entity: Partial<RoadsideAssistanceDocument>): Promise<RoadsideAssistanceDocument | null>;
  createQuotation(entity: Partial<QuotationDocument>): Promise<RoadsideAssistanceDocument | null>;
  cancelQuotation(params: { serviceId: Types.ObjectId }): Promise<void>;
  cancelService(params: { serviceId: Types.ObjectId }): Promise<void>;
  getInvoice(params: { serviceId: Types.ObjectId, userId: Types.ObjectId }): Promise<any>;
  serviceHistory(mechanicId:Types.ObjectId,page:number,search?:string): Promise<LiveAssistanceHistoryResponse>
}
