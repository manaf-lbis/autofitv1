import { MechanicDocument } from "../models/mechanicModel";

export interface MechnaicNameAndEmailDTO {
    name: string;
    email: string;
}

export interface AdminMechanicDTO {
    id : string
    name: string,
    email: string,
    mobile: string,
    role: string,
    status: string
}

export interface MechanicDetailsWithId extends MechnaicNameAndEmailDTO {
    id: string
}



export class MechanicMapper {

    static toMechnaicNameEmail(mechanic: MechanicDocument): MechnaicNameAndEmailDTO {
        return {
            name: mechanic.name,
            email: mechanic.email
        }
    }
    static toMechanicDetailsWithId(mechanic: MechanicDocument): MechanicDetailsWithId {
        return {
            id: mechanic._id.toString(),
            name: mechanic.name,
            email: mechanic.email
        }
    }

    static toAdminMechanic(mechanic: MechanicDocument): AdminMechanicDTO {
        return {
            id: mechanic._id.toString(),
            name: mechanic.name,
            email: mechanic.email,
            mobile: mechanic.mobile,
            role: mechanic.role,
            status: mechanic.status
        }
    }

}







