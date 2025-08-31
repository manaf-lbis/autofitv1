import { MechanicDocument } from "../models/mechanicModel";

export interface MechnaicNameAndEmailDTO {
    name: string;
    email: string;
}



export class MechanicMapper {

    static toMechnaicNameEmail(mechanic: MechanicDocument): MechnaicNameAndEmailDTO {
        return {
            name: mechanic.name,
            email: mechanic.email
        }
    }





}







