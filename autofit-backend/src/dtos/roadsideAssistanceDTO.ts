import { RoadsideAssistanceDocument } from "../models/roadsideAssistanceModel";
import { RoadsideAssistanceStatus } from "../types/services";

export interface RoadsideAssistanceDTO {
    id: string,
    issue: string,
    description: string,
    vehicle: {
        regNo: string,
        brand: string,
        modelName: string,
        owner: string,
    },
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
            vehicle: {
                regNo: assistance.vehicle.regNo,
                brand: assistance.vehicle.brand,
                modelName: assistance.vehicle.modelName,
                owner: assistance.vehicle.owner,
            },
            status: assistance.status,
            startedAt: assistance.startedAt,
            endedAt: assistance.endedAt

        };
    };





}


