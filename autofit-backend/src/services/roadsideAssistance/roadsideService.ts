import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
import { IQuotationRepository } from "../../repositories/interfaces/IQuotationRepository";
import { QuotationDocument } from "../../models/quotationModel";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IRoadsideService } from "./interface/IRoadsideService";

export class RoadsideService implements IRoadsideService {
  constructor(
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _quotationRepo : IQuotationRepository,
    private _mechanicProfileRepo : IMechanicProfileRepository

  ) { }

  async serviceDetails(serviceId: Types.ObjectId) {
    return await this._roadsideAssistanceRepo.findById(serviceId)
  }

  async updateStatus(userId: Types.ObjectId ,serviceId: Types.ObjectId, entity: Partial<RoadsideAssistanceDocument>) {

    if(entity.status === 'analysing'){
      entity.arrivedAt = new Date()
    } else if(entity.status === 'completed'){
      entity.endedAt = new Date()
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(userId,{availability:'available'})
    }
    return await this._roadsideAssistanceRepo.update(serviceId, entity)
  }

  async createQuotation(entity:Partial<QuotationDocument>) {
    const {_id,serviceId} = await this._quotationRepo.save(entity);
    return await this._roadsideAssistanceRepo.update(serviceId,{quotationId:_id,status:"quotation_sent"});
  }

  async cancelQuotation({serviceId}:{serviceId:Types.ObjectId}){
    const response = await this._roadsideAssistanceRepo.update(serviceId,{status:'canceled'})
    if(response){
       await this._quotationRepo.update(response?.quotationId as Types.ObjectId,{status:'rejected'});
       await this._mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId,{availability:'available'})
    }
  }

  async cancelService({serviceId}:{serviceId:Types.ObjectId}){

    const response = await this._roadsideAssistanceRepo.update(serviceId,{status:'canceled'})
    if(response?.quotationId){
       await this._quotationRepo.update(response?.quotationId as Types.ObjectId,{status:'rejected'});
    }

    if(response){
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId,{availability:'available'})
    }
  }


}