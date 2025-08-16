import { Types } from "mongoose";
import { PretripReportDocument } from "../../models/pretripReportModel";
import { IBaseRepository } from "./IBaseRepository";
import { Report } from "../../services/pretripCheckup/interface/IPretripService";

export interface IPretripReportRepository extends IBaseRepository<PretripReportDocument> {
    updateReport(reportId: Types.ObjectId,report: Report[], mechanicNotes: string):Promise<PretripReportDocument>
}