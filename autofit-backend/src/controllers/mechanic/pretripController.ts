import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { IPretripService } from "../../services/pretripCheckup/interface/IPretripService";
import { ApiError } from "../../utils/apiError";
import { IProfileService } from "../../services/mechanic/interface/IProfileService";
import { Types } from "mongoose";
import { HttpStatus } from "../../types/responseCode";



export class PretripController {
    constructor(
        private _pretripService: IPretripService,
        private _mechnanicProfileService: IProfileService
    ) { }


    async weeklySchedules(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            if (!mechanicId) throw new ApiError('Invalid User')
            const result = await this._pretripService.weeklySchedules(mechanicId)

            sendSuccess(res, 'Success', result);
        } catch (err) {
            next(err);
        }
    }

    async workDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            const serviceId = req.params.id
            if (!serviceId || !mechanicId) throw new ApiError('Invalid Parameters', HttpStatus.BAD_REQUEST);
            if (!mechanicId) throw new ApiError('Invalid User')
            const result = await this._pretripService.workDetails(mechanicId, new Types.ObjectId(serviceId))

            sendSuccess(res, 'Success', result);
        } catch (err) {
            next(err);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            const { serviceId, status } = req.body
            if (!serviceId || !mechanicId) throw new ApiError('Invalid Parameters', HttpStatus.BAD_REQUEST);
            if (!mechanicId) throw new ApiError('Invalid User')
            const result = await this._pretripService.updateStatus(mechanicId, new Types.ObjectId(serviceId), status)

            sendSuccess(res, 'Success', result);
        } catch (err) {
            next(err);
        }
    }

    async createReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            const { serviceId, report, mechanicNotes } = req.body
            if (!serviceId) throw new ApiError('Invalid Parameters', HttpStatus.BAD_REQUEST);
            if (!mechanicId) throw new ApiError('Invalid User')

            const result = await this._pretripService.createReport(mechanicId,serviceId,report,mechanicNotes)

            sendSuccess(res, 'Success',result);
        } catch (err) {
            next(err);
        }
    }

    async serviceHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id
            const {page} = req.query

            if(!page || isNaN(Number(page))) throw new ApiError('Invalid page number',HttpStatus.BAD_REQUEST)
            if (!mechanicId) throw new ApiError('Invalid User')

            
            const serviceHistory = await this._pretripService.pretripServiceHistory(mechanicId,Number(page))
            sendSuccess(res, 'Success', serviceHistory);

        } catch (err) {
            next(err);
        }
    }







}

