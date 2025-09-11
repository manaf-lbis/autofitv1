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
            const duration = req.query.duration as TransactionDurations;

            if (!Object.values(TransactionDurations).includes(duration)) {
                throw new ApiError('Invalid Duration', HttpStatus.BAD_REQUEST);
            }

            let fromStr: string | undefined;
            let toStr: string | undefined;
            if (duration === TransactionDurations.CUSTOM) {
                fromStr = req.query.from as string;
                toStr = req.query.to as string;
                if (!fromStr || !toStr) {
                    throw new ApiError('From and To dates required for custom duration', HttpStatus.BAD_REQUEST);
                }
            }

            if (!mechanicId) throw new ApiError('Invalid User', HttpStatus.BAD_REQUEST);

            const transactionsData = await this._pageService.transactions(
                new Types.ObjectId(mechanicId),
                duration,
                fromStr,
                toStr
            );

            sendSuccess(res, 'Successfully Fetched', transactionsData);
        } catch (error: any) {
            next(error);
        }
    }


}

