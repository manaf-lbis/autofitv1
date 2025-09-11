
import { MechanicProfileDocument } from "../models/mechanicProfileModel";
import { AdminMechanicDTO, MechanicMapper } from "./mechnaicDTO";

export interface MechanicProfileDetails {
    id: string
    registration: {
        status: string,
        approvedOn: Date
    },
    education: string,
    availability: string,
    specialised: string,
    experience: number,
    shopName: string,
    place: string,
    location: {
        coordinates: [number, number]
    },
    landmark: string,
    photo: string,
    shopImage: string
    qualification: string,
    createdAt: Date
}

export interface BasicMechanicProfileDetails {
    id: string
    registration: {
        status: string,
    },
    mechanicId: AdminMechanicDTO,
    specialised: string,
    createdAt: Date
}


export class MechanicProfileMapper {

    static toMechnaicProfileDetails(mechanic: MechanicProfileDocument): MechanicProfileDetails {
        return {
            id: mechanic._id.toString(),
            registration: {
                status: mechanic.registration.status,
                approvedOn: mechanic.registration.approvedOn
            },
            education: mechanic.education,
            availability: mechanic.availability,
            specialised: mechanic.specialised,
            experience: mechanic.experience,
            shopName: mechanic.shopName,
            place: mechanic.place,
            location: mechanic.location,
            landmark: mechanic.landmark,
            photo: mechanic.photo,
            shopImage: mechanic.shopImage,
            qualification: mechanic.qualification,
            createdAt: mechanic.createdAt

        }
    }

    static toMechanicProfileBasicDetails(mechanic: MechanicProfileDocument): BasicMechanicProfileDetails {
        return {
            id: mechanic._id.toString(),
            registration: {
                status: mechanic.registration.status
            },
            createdAt: mechanic.createdAt,
            mechanicId: MechanicMapper.toAdminMechanic(mechanic.mechanicId as any) ,
            specialised: mechanic.specialised
        }
    }


}

