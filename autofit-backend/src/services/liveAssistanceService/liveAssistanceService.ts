import { differenceInMinutes, format, startOfDay } from "date-fns";
import { IWorkingHoursRepository } from "../../repositories/interfaces/IWorkingHoursRepository";
import { ILiveAssistanceService } from "./ILiveAssistanceService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { Types } from "mongoose";
import { ITimeBlockRepository } from "../../repositories/interfaces/ITimeBlockRepository";
import { BlockType } from "../../models/timeBlock";
import { ILiveAssistanceRepository } from "../../repositories/interfaces/ILiveAssistanceRepository";

export class LiveAssistanceService implements ILiveAssistanceService {
    constructor(
        private _workingHoursRepo: IWorkingHoursRepository,
        private _timeBlockingRepo: ITimeBlockRepository,
        private _liveAssistanceRepo: ILiveAssistanceRepository
    ) { }

    async createBooking(concern: string, description: string, userId: Types.ObjectId): Promise<any> {

        const now = new Date();
        const today = format(now, "EEEE").toLowerCase();
        const start = startOfDay(now);
        const currentMinutes = differenceInMinutes(now, start);

        const totalDurationWithBuffer = Number(process.env.PAYMENT_BUFFER) + Number(process.env.LIVE_ASSISTANCE_DURATION)

        const mechanicsList = await this._workingHoursRepo.findAvailabelMechanicsByday(today, currentMinutes, currentMinutes + totalDurationWithBuffer);
        if (!mechanicsList.length || !mechanicsList) throw new ApiError('No Mechanic is available at this time', HttpStatus.BAD_REQUEST);

        const mechanicIds = mechanicsList.map((mechanic: { _id: Types.ObjectId, mechanicId: Types.ObjectId }) => mechanic.mechanicId);

        const blockedMechnaicList = await this._timeBlockingRepo.checkIsBlocked(mechanicIds, currentMinutes, currentMinutes + totalDurationWithBuffer);

        const availableMechanics = mechanicIds.filter(
            (id: Types.ObjectId) => !blockedMechnaicList.map((b:Types.ObjectId) => b.toString()).includes(id.toString())
        );

        if (!availableMechanics.length) throw new ApiError('No Mechanic is available at this time', HttpStatus.BAD_REQUEST);

        const randomIndex = Math.floor(Math.random() * availableMechanics.length);
        const randomAvailableMechnaic = availableMechanics[randomIndex];

        const blocking = await this._timeBlockingRepo.save({
            mechanicId: randomAvailableMechnaic,
            startMinutes: currentMinutes,
            endMinutes: currentMinutes + totalDurationWithBuffer,
            date: now,
            reason: 'Blocked for live assistance',
            blockType: BlockType.PAYMENT_DELAY
        });

        const booking = await this._liveAssistanceRepo.save({
            issue: concern.trim(),
            description: description.trim(),
            mechanicId: randomAvailableMechnaic,
            blockedTimeId: blocking._id,
            duration: Number(process.env.LIVE_ASSISTANCE_DURATION),
            userId,
        });

        return {
            bookingId: booking._id,
            mechanicId: randomAvailableMechnaic
        }
    }

    async getDetails(serviceId: Types.ObjectId,userId:Types.ObjectId): Promise<any> {
        const booking = await this._liveAssistanceRepo.getServiceDetails(serviceId);
        if (!booking || booking.userId.toString() !== userId.toString() ) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        return booking
    }

    async getSessionDetails(serviceId: Types.ObjectId, userId: Types.ObjectId): Promise<any> {
        const booking = await this._liveAssistanceRepo.findById(serviceId);
        if (!booking || booking.userId.toString() !== userId.toString() ) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        if(booking.endTime >= new Date()) throw new ApiError('Service is already completed', HttpStatus.BAD_REQUEST);

        return {
            sessionId: booking.sessionId,
            mechanicId: booking.mechanicId
        }
    }

    async activeBookingsByMechanicId(mechanicId: Types.ObjectId): Promise<any> {
        return await this._liveAssistanceRepo.activeBookingsByMechanicId(mechanicId);
    }



}