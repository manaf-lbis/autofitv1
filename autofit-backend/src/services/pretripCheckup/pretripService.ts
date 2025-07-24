import { Types } from "mongoose";
import { IPretripSlotRepository } from "../../repositories/interfaces/IPretripSlotRepository";
import { IPretripService } from "./interface/IPretripService";
import { startOfDay, addDays } from 'date-fns';
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IGoogleMapRepository } from "../../repositories/interfaces/IGoogleMapRepository";

export class PretripService implements IPretripService {

    constructor(
        private _pretripSlotRepository: IPretripSlotRepository,
        private _mechanicProfileRepository: IMechanicProfileRepository,
        private _googleMapRepo: IGoogleMapRepository

    ) { }

    async getSlotWihtMechId(mechanicId: Types.ObjectId): Promise<any> {
        const today = new Date();
        const start = startOfDay(today);
        const end = startOfDay(addDays(today, 7));

        return await this._pretripSlotRepository.getSlots(mechanicId, start, end);
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

    // async getNearbyMechanicsWithSlot(coord: { lat: number; lng: number; }): Promise<any> {
    //     const mechanicList = await this._mechanicProfileRepository.findMechnaicWithRadius({
    //         radius: Number(process.env.FINDING_RADIUS_OF_MECHANIC),
    //         lat: coord.lat,
    //         lng: coord.lng,
    //         checkAvailablity: false
    //     });

    //     if (!mechanicList.length) return [];

    //     const destinations = mechanicList.map((mech) => ({
    //         lat: mech.location.coordinates[1],
    //         lng: mech.location.coordinates[0],
    //     }));

    //     const mechanicIds = mechanicList.map((mechanic) => mechanic.mechanicId);
    //     const slotPromises = mechanicIds.map(async (mechanicId) => {
    //         return this.getSlotWihtMechId(mechanicId);
    //     });
    //     const slots = await Promise.all(slotPromises);


    //     const { distances } = await this._googleMapRepo.getDistanceMatrix(coord, destinations);
    //     const enriched = mechanicList.map((mech, index) => ({
    //         ...mech,
    //         distanceInMeters: distances[index],
    //     }));

    //        const mechanics =  enriched.map((mech)=>{
    //             if(slots.find((slot)=>slot.mechanicId === mech.mechanicId)){
    //                 return {
    //                     ...mech,
    //                     hasSlots: true
    //                 }
    //             }else{
    //                 return {
    //                     ...mech,
    //                     hasSlots: false
    //                 }
    //             }
    //         })



    //     return { mechanics, slots };
    // }



    async getNearbyMechanicsWithSlot(coord: { lat: number; lng: number }): Promise<{ mechanics: any[]; slots: any[] }> {

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



}