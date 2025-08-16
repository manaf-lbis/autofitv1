import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { IPageService } from "../../services/mechanic/interface/IPageService";
import { TransactionDurations } from "../../types/transaction";
import { HttpStatus } from "../../types/responseCode";
import { Types } from "mongoose";


export class PageController {
    constructor(
        private _pageService: IPageService
    ) { }

    async dashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user?.id;
            if (!id) throw new ApiError('Invalid User')
            const dashboard = await this._pageService.dashboard(id);
            sendSuccess(res, 'Successfully Fetched', dashboard);
        } catch (error: any) {
            next(error);
        }
    }


    async primaryInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user?.id;
            if (!id) throw new ApiError('Invalid User')

            const primaryInfo = await this._pageService.primaryInfo(id);

            sendSuccess(res, 'Successfully Fetched', primaryInfo);

        } catch (error: any) {
            next(error);
        }
    }

    async transactions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mechanicId = req.user?.id;
            const duration = req.query.duration
            
            if(!Object.values(TransactionDurations).includes(duration as TransactionDurations)){
                throw new ApiError('Invalid Duration',HttpStatus.BAD_REQUEST)
            }

            if (!mechanicId) throw new ApiError('Invalid User')

            const transactions = await this._pageService.transactions(new Types.ObjectId(mechanicId), duration as TransactionDurations);

            sendSuccess(res, 'Successfully Fetched', transactions);

        } catch (error: any) {
            next(error);
        }
    }


}

