import { PretripBookingDocument } from "../models/pretripBooking";
import { PretripStatus } from "../types/pretrip";
import { UserBasicInfoDTO, UserMapper } from "./userDto";
import { VehicleDTO, VehicleMapper } from "./vehicleDto";

export interface PretripDTO {
    id: string,
    status : PretripStatus
    userId : UserBasicInfoDTO
    vehicleId : VehicleDTO
    schedule : {
        start : Date,
        end : Date
    },
    servicePlan :{
        name : string,
        description : string,
    }
}

export class PretripMapper {

    static toPretripInfo(pretrip: PretripBookingDocument): PretripDTO {
        return {
            id: pretrip._id.toString(),
            status : pretrip.status,
            userId : UserMapper.toUserBasicInfo(pretrip.userId as any),
            vehicleId : VehicleMapper.toVehicleDto(pretrip.vehicleId),
            schedule : pretrip.schedule,
            servicePlan : {
                name : (pretrip.serviceReportId as any).servicePlan .name,
                description : (pretrip.serviceReportId as any).servicePlan.description
            }
           

        };
    };

}


