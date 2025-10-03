import { differenceInMinutes, format, formatDate, startOfDay } from "date-fns";
import { IWorkingHoursRepository } from "../../repositories/interfaces/IWorkingHoursRepository";
import { ILiveAssistanceService, LiveAssistanceHistoryResponse } from "./ILiveAssistanceService";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { Types } from "mongoose";
import { ITimeBlockRepository } from "../../repositories/interfaces/ITimeBlockRepository";
import { BlockType } from "../../models/timeBlock";
import { ILiveAssistanceRepository } from "../../repositories/interfaces/ILiveAssistanceRepository";
import { Role } from "../../types/role";
import { generateReceiptPDF } from "../../utils/templates/receiptTemplate";
import { LiveAssistanceStatus } from "../../types/liveAssistance";
import { INotificationService } from "../notifications/INotificationService";

export class LiveAssistanceService implements ILiveAssistanceService {
    constructor(
        private _workingHoursRepo: IWorkingHoursRepository,
        private _timeBlockingRepo: ITimeBlockRepository,
        private _liveAssistanceRepo: ILiveAssistanceRepository,
        private _notificationService: INotificationService
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
            (id: Types.ObjectId) => !blockedMechnaicList.map((b: Types.ObjectId) => b.toString()).includes(id.toString())
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

    async getDetails(serviceId: Types.ObjectId, userId: Types.ObjectId): Promise<any> {
        const booking = await this._liveAssistanceRepo.getServiceDetails(serviceId);
        if (!booking || booking.userId.toString() !== userId.toString()) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        return booking
    }

    async getSessionDetails(serviceId: Types.ObjectId, userId: Types.ObjectId): Promise<any> {
        const booking = await this._liveAssistanceRepo.findById(serviceId);
        if (!booking || booking.userId.toString() !== userId.toString()) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        if (booking.endTime <= new Date()) throw new ApiError('Service is already completed', HttpStatus.BAD_REQUEST);

        return {
            userId,
            sessionId: booking.sessionId,
            mechanicId: booking.mechanicId
        }
    }

    async activeBookingsByMechanicId(mechanicId: Types.ObjectId): Promise<any> {
        return await this._liveAssistanceRepo.activeBookingsByMechanicId(mechanicId);
    }

    async serviceHistory(userId: Types.ObjectId, page: number): Promise<LiveAssistanceHistoryResponse> {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ? 0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const response = await this._liveAssistanceRepo.pagenatedLiveAssistanceHistory({ end, start, userId, role: Role.MECHANIC, sortBy: 'desc' })

        return {
            totalDocuments: response.totalDocuments,
            hasMore: response.totalDocuments > end,
            history: response.history
        }
    }

    async getInvoice(serviceId: Types.ObjectId): Promise<any> {
        const booking = await this._liveAssistanceRepo.detailedBooking(serviceId);
        if (!booking) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        if (booking.status !== LiveAssistanceStatus.COMPLETED) throw new ApiError('Service is not completed', HttpStatus.BAD_REQUEST);

        return generateReceiptPDF({
            customer: {
                name: booking.userId.name,
                email: booking.userId.email,
                phone: booking.userId.phone
            },
            items: [{
                description: 'Live Assistance',
                rate: Number(process.env.LIVE_ASSISTANCE_PRICE),
                qty: 1
            }],
            serviceDate: formatDate(booking.createdAt, "dd MMM yyyy"),
            documentType: 'RECEIPT',
            notes: `Assistance For the Issue Was Completed on ${formatDate(booking.updatedAt, "dd MMM yyyy")}`,
            reference: booking._id.toString(),
            tax: {
                type: 'percent',
                value: Number(process.env.TAX)
            }
        })
    }

    async markAsCompleted(serviceId: Types.ObjectId, userId: Types.ObjectId, role: Role): Promise<any> {
        const booking = await this._liveAssistanceRepo.findById(serviceId);
        if (role === Role.USER) {
            if (!booking || booking.userId.toString() !== userId.toString()) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        } else if (role === Role.MECHANIC) {
            if (!booking || booking.mechanicId.toString() !== userId.toString()) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        } else {
            throw new ApiError('Invalid User')
        }

        await this._timeBlockingRepo.delete(booking.blockedTimeId)
        await this._liveAssistanceRepo.update(serviceId, { status: LiveAssistanceStatus.COMPLETED });

        await this._notificationService.sendNotification({
            recipientId: booking.userId,
            message: `Live Assistance Completed by Mechanic`,
            recipientType: 'user'
        })


    }



}