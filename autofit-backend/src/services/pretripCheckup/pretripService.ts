import { ICreateBookingParams, IPretripService, PretripServiceHistoryResponse, Report } from "./interface/IPretripService";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { IPretripPlanRepository } from "../../repositories/interfaces/IPretripPlanRepository";
import { IWorkingHoursRepository } from "../../repositories/interfaces/IWorkingHoursRepository";
import { addDays, format, formatDate, getHours, getMinutes, isToday, startOfDay } from "date-fns";
import { convertHHMMToMinutes, convertMinutesToHHMM, dateAndTimeToDateString, findDayByISODate } from "../../utils/dateAndTimeFormater";
import { COMPANY_ADDRESS, COMPANY_EMAIL, DAYS_OF_WEEK } from "../../utils/constants";
import { ITimeBlockRepository } from "../../repositories/interfaces/ITimeBlockRepository";
import { ApiError } from "../../utils/apiError";
import { BlockType } from "../../models/timeBlock";
import { Types } from "mongoose";
import { IPretripReportRepository } from "../../repositories/interfaces/IPretripReportRepository";
import { HttpStatus } from "../../types/responseCode";
import { PretripStatus } from "../../types/pretrip";
import { reportItemsSchema } from "../../validation/pretripValidations";
import { ZodError } from "zod";
import { ITransactionRepository } from "../../repositories/interfaces/ITransactionRepository";
import { TransactionStatus } from "../../types/transaction";
import { generateTransactionId, getDeductionRate } from "../../utils/transactionUtils";
import { ServiceType } from "../../types/services";
import { IPaymentRepository } from "../../repositories/interfaces/IPaymentRepository";
import { Role } from "../../types/role";
import { generateReceiptPDF } from "../../utils/templates/receiptTemplate";
import { generateInspectionReportPDF } from "../../utils/templates/serviceReportTeplate";




export class PretripService implements IPretripService {

    constructor(
        private _mechanicProfileRepository: IMechanicProfileRepository,
        private _googleMapRepo: IGoogleMapRepository,
        private _pretripBookingRepository: IPretripBookingRepository,
        private _planRepository: IPretripPlanRepository,
        private _workingHoursRepo: IWorkingHoursRepository,
        private _timeBlockingRepo: ITimeBlockRepository,
        private _pretripReportRepo: IPretripReportRepository,
        private _transactionRepo: ITransactionRepository,
        private _paymentRepository: IPaymentRepository
    ) { }


    async createBooking({ coords, mechanicId, planId, slot, vehicleId, userId }: ICreateBookingParams): Promise<any> {
        const [startingTime, endingTime] = slot.time.split('-');
        const day = findDayByISODate(slot.date);
        const startingMinute = convertHHMMToMinutes(startingTime);
        const endingMinute = convertHHMMToMinutes(endingTime);

        if (startingMinute >= endingMinute) {
            throw new ApiError('End time must be after start time');
        }

        const isWithinWorkingHours = await this._workingHoursRepo.checkAvailablity({
            mechanicId, day,
            startingMinute,
            endingMinute
        });

        if (!isWithinWorkingHours) throw new ApiError('Mechanic is not available at selected time');

        const slotDate = new Date(slot.date);
        const now = new Date();
        if (isToday(slotDate)) {
            const currentMinutes = getHours(now) * 60 + getMinutes(now);
            if (startingMinute <= currentMinutes) {
                throw new ApiError('Cannot book a slot in the past for today');
            }
        }

        const date = startOfDay(slotDate);
        const overlappingBlocks = await this._timeBlockingRepo.findOverlappingBlocks(
            mechanicId,
            date,
            startingMinute,
            endingMinute
        );

        const plan = await this._planRepository.findPlanDetails(planId);
        if (!plan) throw new ApiError('Plan not found');
        const { name, description, price, originalPrice, features, duration } = plan;

        if (!duration) throw new ApiError('Plan duration is required');

        let totalAvailableMinutes = endingMinute - startingMinute;
        const continuousSlotRequested = totalAvailableMinutes === duration;

        if (overlappingBlocks.length > 0) {
            if (continuousSlotRequested) {
                throw new ApiError('Cannot book a continuous slot due to existing bookings or blocks');
            }

            let blockedMinutes = 0;
            for (const block of overlappingBlocks) {
                const blockStart = Math.max(startingMinute, block.startMinutes);
                const blockEnd = Math.min(endingMinute, block.endMinutes);
                blockedMinutes += blockEnd - blockStart;
            }

            totalAvailableMinutes -= blockedMinutes;

            if (totalAvailableMinutes < duration) {
                throw new ApiError(
                    `Not enough available time (${totalAvailableMinutes} minutes) for the ${duration}-minute service`
                );
            }
        } else if (totalAvailableMinutes < duration) {
            throw new ApiError(
                `Selected slot (${totalAvailableMinutes} minutes) is too short for the ${duration}-minute service`
            );
        }

        const startDateTime = dateAndTimeToDateString(slot.date, startingTime);
        const endDateTime = dateAndTimeToDateString(slot.date, endingTime);

        const report = await this._pretripReportRepo.save({
            servicePlan: {
                name,
                description,
                price,
                originalPrice
            },
            reportItems: features.map((feature: any) => ({ feature }))
        })

        const booking = await this._pretripBookingRepository.save({
            userId,
            vehicleId,
            mechanicId,
            schedule: {
                start: startDateTime,
                end: endDateTime
            },
            serviceReportId: report._id,
            pickupLocation: {
                type: "Point",
                coordinates: [coords.lng, coords.lat]
            }
        });

        await this._timeBlockingRepo.save({
            mechanicId,
            date,
            startMinutes: startingMinute,
            endMinutes: endingMinute,
            blockType: BlockType.PAYMENT_DELAY,
            userId,
            reason: `Booking for ${name}`
        });

        return {
            coords,
            bookingId: booking._id,
            schedule: {
                start: format(startDateTime, 'yyyy-MM-dd HH:mm'),
                end: format(endDateTime, 'yyyy-MM-dd HH:mm')
            }
        };
    }


    async transformMechanicsSchedule(mechanics: any, workingHours: any, startDate: Date = new Date()) {
        const daysOfWeek = DAYS_OF_WEEK.split(',');

        const mechanicIds = mechanics.map((mechanic: any) => mechanic.mechanicId);
        const start = startOfDay(startDate);
        const end = startOfDay(addDays(startDate, 7));

        const timeBlocks = await this._timeBlockingRepo.findBlockingByDateRange(mechanicIds, start, end);

        return mechanics.map((mechanic: any) => {
            const mechanicIdStr = mechanic.mechanicId.toString();
            const mechanicHours = workingHours.find((wh: any) => wh.mechanicId.toString() === mechanicIdStr) || {};
            const availableWindows: { [date: string]: { start: string; end: string }[] } = {};

            for (let i = 0; i < 7; i++) {
                const date = addDays(startDate, i);
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayName = daysOfWeek[date.getDay()].toLowerCase();
                const dayAvailability = (mechanicHours as any)[dayName] || { isOpen: false };

                if (!dayAvailability.isOpen) {
                    availableWindows[dateKey] = [];
                    continue;
                }

                const openTime = dayAvailability.openTime;
                const closeTime = dayAvailability.closeTime;

                const blocksForDay = timeBlocks.filter(
                    (block: any) =>
                        block.mechanicId.toString() === mechanicIdStr &&
                        format(block.date, 'yyyy-MM-dd') === dateKey
                );
                blocksForDay.sort((a: any, b: any) => a.startMinutes - b.startMinutes);

                let windows: { start: number; end: number }[] = [{ start: openTime, end: closeTime }];

                for (const block of blocksForDay) {
                    const newWindows: { start: number; end: number }[] = [];
                    for (const window of windows) {
                        if (block.endMinutes <= window.start || block.startMinutes >= window.end) {
                            newWindows.push(window);
                            continue;
                        }

                        if (block.startMinutes > window.start) {
                            newWindows.push({ start: window.start, end: block.startMinutes });
                        }

                        if (block.endMinutes < window.end) {
                            newWindows.push({ start: block.endMinutes, end: window.end });
                        }
                    }
                    windows = newWindows;
                }

                availableWindows[dateKey] = windows.map(window => ({
                    start: convertMinutesToHHMM(window.start),
                    end: convertMinutesToHHMM(window.end)
                }));
            }

            return {
                mechanicId: mechanicIdStr,
                shopName: mechanic.shopName,
                distanceInMeters: mechanic.distanceInMeters,
                place: mechanic.place,
                specialised: mechanic.specialised,
                availableWindows
            };
        });
    }

    async getNearbyMechanics(params: { lat: number; lng: number }): Promise<any> {
        const nearestMechanics = await this._mechanicProfileRepository.findMechnaicWithRadius({
            radius: 10,
            lat: params.lat,
            lng: params.lng,
            checkAvailablity: false
        });
        if (!nearestMechanics.length) return [];

        const destinations = nearestMechanics.map((mech) => ({
            lat: mech.location.coordinates[1],
            lng: mech.location.coordinates[0]
        }));

        const { distances, durations } = await this._googleMapRepo.getDistanceMatrix({ lat: params.lat, lng: params.lng }, destinations);

        const nearestMechanicsWithDistance = nearestMechanics.map((mech, index) => ({
            ...mech,
            distanceInMeters: distances[index],
            durationInSeconds: durations[index]
        }));

        const mechanicIds = nearestMechanics.map((mechanic) => mechanic.mechanicId);
        const workingHours = await this._workingHoursRepo.workingHoursOfMultipleMechanics(mechanicIds);

        return this.transformMechanicsSchedule(nearestMechanicsWithDistance, workingHours);
    }

    async weeklySchedules(mechanicId: Types.ObjectId): Promise<any> {
        const start = startOfDay(new Date());
        const end = addDays(start, 6);
        const bookings = await this._pretripBookingRepository.weeklyScheduleOfMechanic(mechanicId);
        const blockingsByMech = await this._timeBlockingRepo.findBlockingByDateRange(mechanicId, start, end, BlockType.MECHANIC_BLOCK);

        const blockings = blockingsByMech.map((block) => {
            return {
                id: block._id,
                date: block.date,
                startMinutes: convertMinutesToHHMM(block.startMinutes),
                endMinutes: convertMinutesToHHMM(block.endMinutes),
                reason: block.reason
            }
        })

        return { bookings, blockings }
    }

    async workDetails(mechanicId: Types.ObjectId, serviceId: Types.ObjectId): Promise<any> {
        const booking = await this._pretripBookingRepository.detailedBooking(serviceId);
        if (!booking) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        if (booking.mechanicId.toString() !== mechanicId.toString()) throw new ApiError('Invalid Mechanic', HttpStatus.BAD_REQUEST);

        return {
            serviceId: booking._id,
            schedule: booking.schedule,
            status: booking.status,
            user: booking.userId
            , vehicle: {
                registration: booking.vehicleId?.regNo,
                brand: booking.vehicleId?.brand,
                model: booking.vehicleId?.modelName,
                owner: booking.vehicleId?.owner
            }, service: {
                paymentId: booking.payment?.paymentId?.paymentId,
                method: booking.payment?.paymentId?.method,
                status: booking.payment?.paymentId?.status,
                amount: booking.payment?.paymentId?.amount,
            },
            plan: booking?.serviceReportId,
            serviceLocation: booking.pickupLocation?.coordinates
        }
    }

    async updateStatus(mechanicId: Types.ObjectId, serviceId: Types.ObjectId, status: PretripStatus): Promise<any> {

        const booking = await this._pretripBookingRepository.findById(serviceId);
        if (!booking) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        if (booking.mechanicId.toString() !== mechanicId.toString()) throw new ApiError('Invalid Mechanic', HttpStatus.BAD_REQUEST);
        if (booking.status === PretripStatus.CANCELLED) throw new ApiError('Service is already cancelled', HttpStatus.BAD_REQUEST);
        if (booking.status === PretripStatus.VEHICLE_RETURNED) throw new ApiError('Service is already completed', HttpStatus.BAD_REQUEST);
        if (status === PretripStatus.CANCELLED) throw new ApiError('Mechanic cannot cancel the service', HttpStatus.BAD_REQUEST);


        if (status === PretripStatus.VEHICLE_RETURNED) {
            const deductionRate = getDeductionRate(ServiceType.PRETRIP)

            const paymentdetais = await this._paymentRepository.findById(booking.payment?.paymentId!);
            if (!paymentdetais) throw new ApiError('Payment not found', HttpStatus.NOT_FOUND);

            await this._transactionRepo.save({
                serviceId: serviceId,
                mechanicId: mechanicId,
                status: TransactionStatus.RECEIVED,
                deductionAmount: (deductionRate * paymentdetais?.amount) / 100,
                deductionRate: deductionRate,
                grossAmount: paymentdetais?.amount,
                netAmount: paymentdetais?.amount - (deductionRate * paymentdetais?.amount) / 100,
                description: 'Pretrip Checkup',
                transactionId: generateTransactionId(ServiceType.PRETRIP),
                paymentId: paymentdetais._id,
                userId: booking.userId,
                serviceType: ServiceType.PRETRIP,
            })
        }

        if (!Object.values(PretripStatus).includes(status)) throw new ApiError('Invalid Status', HttpStatus.BAD_REQUEST);
        return await this._pretripBookingRepository.update(serviceId, { status })
    }


    async createReport(mechanicId: Types.ObjectId, serviceId: Types.ObjectId, report: Report[], mechanicNotes: string): Promise<any> {
        try {
            console.log(report, mechanicNotes, serviceId);
            reportItemsSchema.parse(report);
            const booking = await this._pretripBookingRepository.findById(serviceId);

            if (!booking) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
            if (booking.mechanicId.toString() !== mechanicId.toString()) throw new ApiError('Invalid Mechanic', HttpStatus.BAD_REQUEST);
            if (booking.status === PretripStatus.COMPLETED) throw new ApiError('Service is already completed', HttpStatus.BAD_REQUEST);
            if (booking.status === PretripStatus.CANCELLED) throw new ApiError('Service is already cancelled', HttpStatus.BAD_REQUEST);
            if (booking.status === PretripStatus.REPORT_CREATED || booking.status === PretripStatus.VEHICLE_RETURNED) {
                throw new ApiError('Report is already created', HttpStatus.BAD_REQUEST);
            }


            const result = await this._pretripReportRepo.updateReport(booking.serviceReportId, report, mechanicNotes);
            await this._pretripBookingRepository.update(serviceId, { status: PretripStatus.REPORT_CREATED });
            return result

        } catch (error: any) {
            if (error instanceof ZodError) {
                throw new ApiError(error.issues[0].message, HttpStatus.BAD_REQUEST);
            } else {
                throw new ApiError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    }

    async getDetails(serviceId: Types.ObjectId, userId: Types.ObjectId): Promise<any> {
        const booking = await this._pretripBookingRepository.detailedBooking(serviceId);
        if (!booking || booking.userId._id.toString() !== userId.toString()) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST);
        return booking
    }


    async pretripServiceHistory(userId: Types.ObjectId, page: number): Promise<PretripServiceHistoryResponse> {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ? 0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const response = await this._pretripBookingRepository.pagenatedPretripHistory({ end, start, userId, role: Role.MECHANIC, sortBy: 'desc' })

        return {
            totalDocuments: response.totalDocuments,
            hasMore: response.totalDocuments > end,
            history: response.history
        }
    }

    async getInvoice(serviceId: Types.ObjectId, userId: Types.ObjectId): Promise<any> {

        if (!Types.ObjectId.isValid(serviceId) || !Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid service ID or user ID format");
        }

        const booking = await this._pretripBookingRepository.detailedBooking(serviceId);
        if (!booking) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST)
        if (booking.status !== PretripStatus.VEHICLE_RETURNED) throw new ApiError('Service is not completed', HttpStatus.BAD_REQUEST)


        return generateReceiptPDF({
            customer: {
                name: booking.userId.name,
                email: booking.userId.email,
                phone: booking.userId.phone
            },
            items: [{
                description: `${booking.serviceReportId?.servicePlan?.name} Checkup`,
                qty: 1,
                rate: booking.serviceReportId?.servicePlan?.price
            }],
            serviceDate: formatDate(booking.createdAt, "dd MMM yyyy"),
            discount: booking.serviceReportId?.servicePlan?.originalPrice,
            documentType: 'RECEIPT',
            tax: {
                type: 'percent',
                value: Number(process.env.TAX)
            }
        })
    }

    async generateReport(serviceId: Types.ObjectId): Promise<any> {
        const service = await this._pretripBookingRepository.detailedBooking(serviceId);
        if(!service) throw new ApiError('Invalid Service', HttpStatus.BAD_REQUEST)
        if(service.status !== PretripStatus.VEHICLE_RETURNED) throw new ApiError('Report is not created', HttpStatus.BAD_REQUEST)

       const checks = service.serviceReportId.reportItems.map((item:any)=>{
            return {
                condition : item?.condition,
                feature : item?.feature,
                needsAction : item?.needsAction,
                remarks : item?.remarks
            }
        });


        return generateInspectionReportPDF({
            checks,
            reference: service._id,
            customer :{
                name : service.userId?.name,
                email : service.userId?.email,
                mobile : service.userId.mobile
            },
            overallReport : service.serviceReportId?.mechanicNotes,
            plan :{
                description : service.serviceReportId?.servicePlan?.description,
                price : service.serviceReportId?.servicePlan?.price,
                name : service.serviceReportId?.servicePlan?.name
            },
            preparedBy:{
                address : COMPANY_ADDRESS,
                email : COMPANY_EMAIL,
                mechanicName : 'mechnaic nae'
            },
            reportDate : formatDate(service.createdAt, "dd MMM yyyy"),
            vehicle :{
                brand : service.vehicleId?.brand,
                model : service.vehicleId?.modelName,
                ownerName : service.vehicleId?.ownerName,
                regNo : service.vehicleId?.regNo
            }
        })

    }


}
