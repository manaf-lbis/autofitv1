import { PretripReportDocument, PretripReportModel } from "../models/pretripReportModel";
import { BaseRepository } from "./baseRepository";
import { IPretripReportRepository } from "./interfaces/IPretripRepository";

export class PretripReportRepository extends BaseRepository<PretripReportDocument> implements IPretripReportRepository {

    constructor (){
        super(PretripReportModel)
    }
    
}