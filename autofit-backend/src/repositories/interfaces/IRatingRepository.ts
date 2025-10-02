import { Types } from "mongoose";
import { RatingDocument } from "../../models/ratingModel";
import { IBaseRepository } from "./IBaseRepository";

export interface IRatingRepository extends IBaseRepository<RatingDocument> {
    avgRatingOfMechanic(mechanicId: Types.ObjectId): Promise<any> 
    avgRatingOfMechanics(mechanicId: Types.ObjectId[]): Promise<any>

}