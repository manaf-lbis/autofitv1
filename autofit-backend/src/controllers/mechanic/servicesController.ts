import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { Types } from "mongoose";
import { ApiError } from "../../utils/apiError";
import { getIO, userSocketMap } from "../../sockets/socket";
import { IRoadsideService } from "../../services/roadsideAssistance/interface/IRoadsideService";



export class ServicesController {
    constructor(
        private _roadsideService: IRoadsideService
    ) {}

    async roadsideAssistanceDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const serviceId = new Types.ObjectId(req.params.id);
            const serviceDetails = await this._roadsideService.serviceDetails(serviceId)


            sendSuccess(res, 'Successfully Fetched', serviceDetails);
        } catch (error: any) {
            next(error);
        }
    }

    async roadsideStatusUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allowedStatus = ['on_the_way', 'analysing', 'quotation_sent', 'completed']
            const { status, bookingId } = req.body;
            const userId = new Types.ObjectId(req.user?.id)
            
            if (!allowedStatus.includes(status)) throw new ApiError('Invalid Status Update')
            const serviceId = new Types.ObjectId(bookingId);

            const user = await this._roadsideService.updateStatus(userId, serviceId, { status })

            const userData = userSocketMap.get(user?.userId?.toString() as string)
            if (userData && userData.socketIds.size > 0) {
                const io = getIO()
                userData.socketIds.forEach((id) => {
                    io.to(id).emit('roadside_assistance_changed', {});
                })
            }

            sendSuccess(res, 'Successfully Fetched');
        } catch (error: any) {
            next(error);
        }
    }

    async quotation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId, items, notes, total } = req.body;

            if (!bookingId || !total || items.length <= 0) throw new ApiError('Invalid Quotation')

            const serviceId = new Types.ObjectId(bookingId)

            const response = await this._roadsideService.createQuotation({ serviceId, items, notes, total })

            const userData = userSocketMap.get(response?.userId.toString() as string)
            if (userData && userData.socketIds.size > 0) {
                const io = getIO()
                userData.socketIds.forEach((id) => {
                    io.to(id).emit('roadside_assistance_changed', {});
                })
            }

            sendSuccess(res, 'Successfully Fetched');
        } catch (error: any) {
            next(error);
        }
    }





}

