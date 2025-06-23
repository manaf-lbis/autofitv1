import { Types } from "mongoose";
import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
import { IBaseRepository } from "./IBaseRepository";
import { CreateRoadsideAssistanceDTO } from "../../types/services";

export interface IRoadsideAssistanceRepo extends IBaseRepository<RoadsideAssistanceDocument> {

    findByUserId(userId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | []>;
    findByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | null>;
    create(entity:CreateRoadsideAssistanceDTO) :Promise<RoadsideAssistanceDocument>;
    ongoingServiceByMechanicId(mechanicId:Types.ObjectId) : Promise<RoadsideAssistanceDocument | null>;
    getActiveServiceId(userId: Types.ObjectId): Promise<Types.ObjectId[]>;
}