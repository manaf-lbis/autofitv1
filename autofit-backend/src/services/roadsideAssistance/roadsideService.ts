import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
import { IQuotationRepository } from "../../repositories/interfaces/IQuotationRepository";
import { QuotationDocument } from "../../models/quotationModel";




export class RoadsideService {
  constructor(
    private roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private quotationRepo : IQuotationRepository
  ) { }

  async serviceDetails(serviceId: Types.ObjectId) {
    return await this.roadsideAssistanceRepo.findById(serviceId)
  }

  async updateStatus(serviceId: Types.ObjectId, entity: Partial<RoadsideAssistanceDocument>) {
    if(entity.status === 'analysing'){
      entity.startedAt = new Date()
    } else if(entity.status === 'completed'){
      entity.endedAt = new Date()
    }
    return await this.roadsideAssistanceRepo.update(serviceId, entity)
  }

  async createQuotation(entity:Partial<QuotationDocument>) {
    const {_id,requestId} = await this.quotationRepo.save(entity);
    await this.roadsideAssistanceRepo.update(requestId, {quotationId:_id,status:"quotation_sent"});
  }




}