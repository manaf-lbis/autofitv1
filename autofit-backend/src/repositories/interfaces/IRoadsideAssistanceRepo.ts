// import { Types } from "mongoose";
// import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
// import { IBaseRepository } from "./IBaseRepository";
// import { CreateRoadsideAssistanceDTO } from "../../types/services";
// import { Role } from "../../types/role";
// import { DashboardRange } from "../../services/admin/interface/IPageService";

// export interface PagenatedResponse {
//     totalDocuments: number;
//     history: RoadsideAssistanceDocument[]
// }
// export interface PagenatedHistoryParams {
//     start: number;
//     end: number;
//     userId: Types.ObjectId;
//     role: Role;
//     sortBy?: 'asc' | 'desc'
//     search?: string
// }



// export interface IRoadsideAssistanceRepo extends IBaseRepository<RoadsideAssistanceDocument> {
//     findByUserId(userId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | []>;
//     findByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | null>;
//     create(entity: CreateRoadsideAssistanceDTO): Promise<RoadsideAssistanceDocument>;
//     ongoingServiceByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument | null>;
//     getActiveServiceId(userId: Types.ObjectId): Promise<Types.ObjectId[]>;
//     pagenatedRoadsideHistory(params: PagenatedHistoryParams): Promise<PagenatedResponse>
//     roadsideAssistanceDetailsByRange(range: DashboardRange): Promise<any>
// }





import { Types } from "mongoose";
import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
import { IBaseRepository } from "./IBaseRepository";
import { CreateRoadsideAssistanceDTO } from "../../types/services";
import { Role } from "../../types/role";
import { GroupBy } from "../../services/admin/interface/IPageService";

export interface PagenatedResponse {
    totalDocuments: number;
    history: RoadsideAssistanceDocument[]
}
export interface PagenatedHistoryParams {
    start: number;
    end: number;
    userId: Types.ObjectId;
    role: Role;
    sortBy?: 'asc' | 'desc'
    search?: string
}



export interface IRoadsideAssistanceRepo extends IBaseRepository<RoadsideAssistanceDocument> {
    findByUserId(userId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | []>;
    findByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | null>;
    create(entity: CreateRoadsideAssistanceDTO): Promise<RoadsideAssistanceDocument>;
    ongoingServiceByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument | null>;
    getActiveServiceId(userId: Types.ObjectId): Promise<Types.ObjectId[]>;
    pagenatedRoadsideHistory(params: PagenatedHistoryParams): Promise<PagenatedResponse>
    roadsideAssistanceDetails(start: Date, end: Date, groupBy: GroupBy): Promise<any>
    detailedBooking(serviceId: Types.ObjectId): Promise<any>
    checkIsCompleted(serviceId: Types.ObjectId[]): Promise<any>
}