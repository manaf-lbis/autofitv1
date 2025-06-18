import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
import { IQuotationRepository } from "../../repositories/interfaces/IQuotationRepository";
import { QuotationDocument } from "../../models/quotationModel";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";




export class RoadsideService {
  constructor(
    private roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private quotationRepo : IQuotationRepository,
    private mechanicProfileRepo : IMechanicProfileRepository

  ) { }

  async serviceDetails(serviceId: Types.ObjectId) {
    return await this.roadsideAssistanceRepo.findById(serviceId)
  }

  async updateStatus(userId: Types.ObjectId ,serviceId: Types.ObjectId, entity: Partial<RoadsideAssistanceDocument>) {

    if(entity.status === 'analysing'){
      entity.arrivedAt = new Date()
    } else if(entity.status === 'completed'){
      entity.endedAt = new Date()
      await this.mechanicProfileRepo.findByMechanicIdAndUpdate(userId,{availability:'available'})
    }

    return await this.roadsideAssistanceRepo.update(serviceId, entity)
  }

  async createQuotation(entity:Partial<QuotationDocument>) {
    const {_id,serviceId} = await this.quotationRepo.save(entity);
    return await this.roadsideAssistanceRepo.update(serviceId,{quotationId:_id,status:"quotation_sent"});
  }

  async cancelQuotation({serviceId}:{serviceId:Types.ObjectId}){
    const response = await this.roadsideAssistanceRepo.update(serviceId,{status:'canceled'})
    if(response){
       await this.quotationRepo.update(response?.quotationId as Types.ObjectId,{status:'rejected'});
       await this.mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId,{availability:'available'})
    }
  }

  async cancelService({serviceId}:{serviceId:Types.ObjectId}){

    const response = await this.roadsideAssistanceRepo.update(serviceId,{status:'canceled'})
    if(response?.quotationId){
       await this.quotationRepo.update(response?.quotationId as Types.ObjectId,{status:'rejected'});
    }

    if(response){
      await this.mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId,{availability:'available'})
    }
   
  }





}