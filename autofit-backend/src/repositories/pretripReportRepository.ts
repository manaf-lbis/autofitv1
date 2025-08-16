import { Types } from "mongoose";
import { PretripReportDocument, PretripReportModel } from "../models/pretripReportModel";
import { Report } from "../services/pretripCheckup/interface/IPretripService";
import { BaseRepository } from "./baseRepository";
import { IPretripReportRepository } from "./interfaces/IPretripReportRepository";
import { ApiError } from "../utils/apiError";
import { CheckupCondition } from "../types/pretrip";

export class PretripReportRepository extends BaseRepository<PretripReportDocument> implements IPretripReportRepository {

    constructor() {
        super(PretripReportModel)
    }


    async updateReport(reportId: Types.ObjectId, report: Report[], mechanicNotes: string): Promise<PretripReportDocument> {
        const reportData = await this._model.findById(reportId);
        if (!reportData) throw new ApiError('Report not found');

        reportData.reportItems = reportData.reportItems.map(item => {
            const update = report.find((u) => u._id === item._id.toString());
            if (!update) return item;
            return {
                _id : item._id,
                feature : item.feature,
                condition : update.condition as CheckupCondition,
                needsAction : update.needsAction,
                remarks : update.remarks
            }
        });
        reportData.mechanicNotes = mechanicNotes
        
        await reportData.save();
        return reportData;
    }

}