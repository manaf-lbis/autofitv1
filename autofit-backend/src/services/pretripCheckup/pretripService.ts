import { Types } from "mongoose";
import { IPretripSlotRepository } from "../../repositories/interfaces/IPretripSlotRepository";
import { IPretripService } from "./interface/IPretripService";
import { startOfDay, addDays } from 'date-fns';
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { PaymentStatus, PretripStatus, SlotStatus } from "../../types/pretrip";
import { ApiError } from "../../utils/apiError";
import { IPretripPlanRepository } from "../../repositories/interfaces/IPretripPlanRepository";

export class PretripService implements IPretripService {

    constructor(
        private _pretripSlotRepository: IPretripSlotRepository,
        private _mechanicProfileRepository: IMechanicProfileRepository,
        private _googleMapRepo: IGoogleMapRepository,
        private _pretripBookingRepository: IPretripBookingRepository,
        private _planRepository: IPretripPlanRepository
    ) { }

    async getSlotWihtMechId(mechanicId: Types.ObjectId, availableOnly = false): Promise<any> {
        const today = new Date();
        const start = startOfDay(today);
        const end = startOfDay(addDays(today, 7));

        return await this._pretripSlotRepository.getSlots(mechanicId, start, end, availableOnly);
    }

    async createSlot(dates: { date: string; }[], mechanicId: Types.ObjectId): Promise<any> {

        const slotPromises = dates.map(async (dateObj) =>
            await this._pretripSlotRepository.save({ mechanicId, date: new Date(dateObj.date) })
        )

        return await Promise.all(slotPromises)
    }

    async removeSlot(slotId: Types.ObjectId): Promise<any> {
        return await this._pretripSlotRepository.delete(slotId);
    }


    async getNearbyMechanicsWithSlot(coord: { lat: number; lng: number }): Promise<{ mechanics: any[]; slots: any[] }> {

        await this._pretripSlotRepository.cleanupExpiredSlots()
        const mechanicList = await this._mechanicProfileRepository.findMechnaicWithRadius({
            radius: Number(process.env.FINDING_RADIUS_OF_MECHANIC),
            lat: coord.lat,
            lng: coord.lng,
            checkAvailablity: false,
        });


        if (!mechanicList.length) return { mechanics: [], slots: [] };

        const destinations = mechanicList.map((mech) => ({
            lat: mech.location.coordinates[1],
            lng: mech.location.coordinates[0],
        }));

        const mechanicIds = mechanicList.map((mech) => mech.mechanicId);

        const slotLists = await Promise.all(
            mechanicIds.map((mechanicId) => this.getSlotWihtMechId(mechanicId))
        );

        const allSlots = slotLists.flat();

        const { distances } = await this._googleMapRepo.getDistanceMatrix(coord, destinations);


        const enrichedMechanics = mechanicList.map((mech, index) => {
            const hasSlot = allSlots.some((slot) => String(slot.mechanicId) === String(mech.mechanicId));
            return {
                ...mech,
                distanceInMeters: distances[index],
                hasSlots: hasSlot,
            };
        });
        return { mechanics: enrichedMechanics, slots: allSlots };
    }


    async createBooking({ coords, mechanicId, planId, slotId, vehicleId, userId }:
        { planId: Types.ObjectId, userId: Types.ObjectId, mechanicId: Types.ObjectId, vehicleId: Types.ObjectId, slotId: Types.ObjectId, coords: { lat: number; lng: number; } }): Promise<any> {

        const slotStaus = await this._pretripSlotRepository.findById(slotId);

        if (!slotStaus) throw new Error('Slot not found');
        if (slotStaus.status !== SlotStatus.AVAILABLE && slotStaus.status !== SlotStatus.CANCELLED) throw new ApiError('Slot is Reserved By Another Person');

        const plan = await this._planRepository.findPlanDetails(planId);
        if (!plan) throw new ApiError('Plan not found');

        const booking = await this._pretripBookingRepository.save({
            userId,
            mechanicId,
            vehicleId,
            slotId,
            payment: {
                status: PaymentStatus.PENDING,
            },
            servicePlan: {
                name: plan.name,
                description: plan.description,
                originalPrice: plan.originalPrice,
                price: plan.price,
                features: plan.features
            },
            pickupLocation: {
                type: "Point",
                coordinates: [coords.lng, coords.lat]
            },
            status: PretripStatus.BOOKED,
        });

        await this._pretripSlotRepository.update(slotId, {
            status: SlotStatus.BLOCKED,
            bookingId: booking._id,
            userId,
            mechanicId,
            vehicleId,
            servicePlan: plan.name,
        });

        return {bookingId: booking._id};
    }



}