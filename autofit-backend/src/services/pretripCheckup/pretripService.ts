import { ICreateBookingParams, IPretripService } from "./interface/IPretripService";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { IPretripPlanRepository } from "../../repositories/interfaces/IPretripPlanRepository";
import { IWorkingHoursRepository } from "../../repositories/interfaces/IWorkingHoursRepository";
import { addDays, format, getHours, getMinutes, isToday, startOfDay } from "date-fns";
import { convertHHMMToMinutes, convertMinutesToHHMM, dateAndTimeToDateString, findDayByISODate } from "../../utils/dateAndTimeFormater";
import { DAYS_OF_WEEK } from "../../utils/constands";
import { ITimeBlockRepository } from "../../repositories/interfaces/ITimeBlockRepository";
import { ApiError } from "../../utils/apiError";
import { BlockType } from "../../models/timeBlock";
import { Types } from "mongoose";



export class PretripService implements IPretripService {

    constructor(
        private _mechanicProfileRepository: IMechanicProfileRepository,
        private _googleMapRepo: IGoogleMapRepository,
        private _pretripBookingRepository: IPretripBookingRepository,
        private _planRepository: IPretripPlanRepository,
        private _workingHoursRepo: IWorkingHoursRepository,
        private _timeBlockingRepo: ITimeBlockRepository
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
        const booking = await this._pretripBookingRepository.save({
            userId,
            vehicleId,
            mechanicId,
            schedule: {
                start: startDateTime,
                end: endDateTime
            },
            servicePlan: {
                name,
                description,
                price,
                originalPrice,
                features
            },
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
            blockType: BlockType.USER_BOOKING,
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
        const blockingsByMech = await this._timeBlockingRepo.findBlockingByDateRange(mechanicId, start, end,BlockType.MECHANIC_BLOCK);

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

    async mySchedules(mechanicId: Types.ObjectId): Promise<any> {
       return await this._pretripBookingRepository.todayScheduleOfMechanic(mechanicId);  
    }



}