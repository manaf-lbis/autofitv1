import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { DashboardRange, IPageService } from "../../services/admin/interface/IPageService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";

export class AdminPagesController {
    constructor(
        private _adminPageService: IPageService

    ) { }


    async dashboard(req: Request, res: Response, next: NextFunction) {
        try {

            const range = req.query.range
            if(!range) throw new ApiError('Invalid range',HttpStatus.BAD_REQUEST)
            if(!Object.values(DashboardRange).includes(range as DashboardRange)){
                throw new ApiError('Invalid range',HttpStatus.BAD_REQUEST)
            }
            const data = await this._adminPageService.dashboard(range as DashboardRange);
            sendSuccess(res, 'Dashboard Data', data)
        } catch (error) {
            next(error)
        }
    }


}