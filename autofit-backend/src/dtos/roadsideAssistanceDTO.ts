import { RoadsideAssistanceDocument } from "../models/roadsideAssistanceModel";
import { VehicleDocument } from "../models/vehicleModel";
import { RoadsideAssistanceStatus } from "../types/services";
import { BasicVehicleDTO, VehicleMapper } from "./vehicleDto";

export interface RoadsideAssistanceDTO {
    id: string,
    issue: string,
    description: string,
    vehicle: BasicVehicleDTO,
    status: RoadsideAssistanceStatus,
    startedAt: Date | null,
    endedAt: Date | null
}



export class RoadsideAssistanceMapper {

    static toRoadsideAssistanceInfo(assistance: RoadsideAssistanceDocument): RoadsideAssistanceDTO {
        return {
            id: assistance._id.toString(),
            issue: assistance.issue,
            description: assistance.description,
            vehicle: VehicleMapper.toBasicVehicleDto(assistance.vehicle as VehicleDocument),
            status: assistance.status,
            startedAt: assistance.startedAt,
            endedAt: assistance.endedAt

        };
    };
}


