import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { PageService } from "../../services/mechanic/pageService";
import { ApiError } from "../../utils/apiError";


export class PageController {
    constructor(
        private pageService: PageService
    ) { }

    async dashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user?.id;

            if (!id) throw new ApiError('Invalid User')

            const dashboard = await this.pageService.dashboard(id);

            sendSuccess(res, 'Successfully Fetched', dashboard);

        } catch (error: any) {
            next(error);
        }
    }


    async primaryInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user?.id;
            if (!id) throw new ApiError('Invalid User')

            const primaryInfo = await this.pageService.primaryInfo(id);

            sendSuccess(res, 'Successfully Fetched', primaryInfo);

        } catch (error: any) {
            next(error);
        }
    }









}

