import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { RoadsideService } from "../../services/roadsideAssistance/roadsideService";
import { Types } from "mongoose";
import { ApiError } from "../../utils/apiError";



export class ServicesController {
    constructor(
        private roadsideService : RoadsideService

    ) {}

    async roadsideAssistanceDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const serviceId = new Types.ObjectId(req.params.id);
            const serviceDetails = await this.roadsideService.serviceDetails(serviceId)
            

            sendSuccess(res, 'Successfully Fetched',serviceDetails);
        } catch (error: any) {
            next(error);
        }
    }

    async  roadsideStatusUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allowedStatus = ['on_the_way','analysing','quotation_sent','completed' ]
            const {status,bookingId} = req.body;

            if(!allowedStatus.includes(status)) throw new ApiError('Invalid Status Update')
            const serviceId =  new Types.ObjectId(bookingId);
            
            await this.roadsideService.updateStatus(serviceId,{status})            
            

            sendSuccess(res, 'Successfully Fetched');
        } catch (error: any) {
            next(error);
        }
    }

    async quotation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           const {bookingId,items,notes,total} = req.body;

           if(!bookingId || !total || items.length <= 0) throw new ApiError('Invalid Quotation')
        
            const requestId = new Types.ObjectId(bookingId)

            await this.roadsideService.createQuotation({requestId,items,notes,total})

           
            sendSuccess(res, 'Successfully Fetched');
        } catch (error: any) {
            next(error);
        }
    }





}

