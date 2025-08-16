import { NextFunction, Request, Response } from "express";
import { ILiveAssistanceService } from "../../services/liveAssistanceService/ILiveAssistanceService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { sendSuccess } from "../../utils/apiResponse";

export class LiveAssistanceController {

    constructor(
        private liveAssistanceService: ILiveAssistanceService
    ) { }

    async createBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { concern, description } = req.body
            const userId = req.user?.id;
            if(!userId) throw new ApiError('User not found', HttpStatus.BAD_REQUEST)
            
            if (!concern || !description) {
                throw new ApiError('Invalid Field', HttpStatus.BAD_REQUEST)
            };
            const booking = await this.liveAssistanceService.createBooking(concern, description, userId)

            sendSuccess(res, 'Booking created successfully', booking)
        } catch (error) {
            next(error)
        }
    }


}