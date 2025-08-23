import { MechanicDto } from "../../dtos/mechanicDto";
import { MechanicDocument } from "../../models/mechanicModel";

export class MechanicMapper {

    static mechanicDto(mechanic :MechanicDocument) :MechanicDto  {
        return {
            id:mechanic._id.toString(),
            name:mechanic.name,
            email:mechanic.email,
            mobile:mechanic.mobile,
            role:mechanic.role,
            status:mechanic.status,
        }
    }



}