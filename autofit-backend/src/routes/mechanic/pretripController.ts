import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { isoDateSchema } from "../../validation/pretripValidations";
import { IPretripService } from "../../services/pretripCheckup/interface/IPretripService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { Types } from "mongoose";



export class PretripController {
    constructor(
        private _pretripService : IPretripService
    ) { }

    async getSlots(req: Request, res: Response, next: NextFunction) {
        try {

            const userId = req.user?.id;
            if(!userId) throw new ApiError('Invalid User',HttpStatus.BAD_REQUEST)
            
            const slot = await this._pretripService.getSlotWihtMechId(userId)
            sendSuccess(res, 'Slots fetched successfully',slot);
            
        } catch (error) {
            next(error)
        }
    }

    async createSlots(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if(!userId) throw new ApiError("Invalid User",HttpStatus.UNAUTHORIZED)

            const { slots } = req.body;
            slots.map((slot:any)=> isoDateSchema.parse(slot.date));
            await this._pretripService.createSlot(slots,userId)
            sendSuccess(res, 'Slots created successfully');  
            
        } catch (error) {
            next(error)
        }
    }

    async removeSlot(req: Request, res: Response, next: NextFunction) {
        try {
            const slotId = req.params.id;
            if(!slotId) throw new ApiError('Slot id is required',HttpStatus.BAD_REQUEST)

            await this._pretripService.removeSlot(new Types.ObjectId(slotId))
            sendSuccess(res, 'Slot removed successfully');

            
        } catch (error) {
            next(error)
        }
    }



}

