import { Types } from "mongoose";
import { RoadsideAssistanceDocument } from "../../../models/roadsideAssistanceModel";
import { QuotationDocument } from "../../../models/quotationModel";

export interface IRoadsideService {

  serviceDetails(serviceId: Types.ObjectId): Promise<RoadsideAssistanceDocument | null>;
  updateStatus(
    userId: Types.ObjectId,
    serviceId: Types.ObjectId,
    entity: Partial<RoadsideAssistanceDocument>
  ): Promise<RoadsideAssistanceDocument | null>;

  createQuotation(entity: Partial<QuotationDocument>): Promise<RoadsideAssistanceDocument | null>;

  cancelQuotation(params: { serviceId: Types.ObjectId }): Promise<void>;

  cancelService(params: { serviceId: Types.ObjectId }): Promise<void>;
}
