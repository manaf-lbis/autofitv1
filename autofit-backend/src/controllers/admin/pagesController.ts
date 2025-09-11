// import { Request, Response, NextFunction } from "express";
// import { sendSuccess } from "../../utils/apiResponse";
// import { DashboardRange, IPageService } from "../../services/admin/interface/IPageService";
// import { ApiError } from "../../utils/apiError";
// import { HttpStatus } from "../../types/responseCode";

// export class AdminPagesController {
//     constructor(
//         private _adminPageService: IPageService

//     ) { }


//     async dashboard(req: Request, res: Response, next: NextFunction) {
//         try {

//             const range = req.query.range
//             if(!range) throw new ApiError('Invalid range',HttpStatus.BAD_REQUEST)
//             if(!Object.values(DashboardRange).includes(range as DashboardRange)){
//                 throw new ApiError('Invalid range',HttpStatus.BAD_REQUEST)
//             }
//             const data = await this._adminPageService.dashboard(range as DashboardRange);
//             sendSuccess(res, 'Dashboard Data', data)
//         } catch (error) {
//             next(error)
//         }
//     }


// }








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
            const range = req.query.range as DashboardRange
            if (!range) throw new ApiError('Invalid range', HttpStatus.BAD_REQUEST)
            if (!Object.values(DashboardRange).includes(range)) {
                throw new ApiError('Invalid range', HttpStatus.BAD_REQUEST)
            }
            let from: Date | undefined
            let to: Date | undefined
            if (range === DashboardRange.CUSTOM) {
              if (!req.query.from || !req.query.to) throw new ApiError('From and to dates required for custom range', HttpStatus.BAD_REQUEST)
              from = new Date(req.query.from as string)
              to = new Date(req.query.to as string)
              if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to) throw new ApiError('Invalid date range', HttpStatus.BAD_REQUEST)
            }
            const data = await this._adminPageService.dashboard(range, from, to)
            sendSuccess(res, 'Dashboard Data', data)
        } catch (error) {
            next(error)
        }
    }


}