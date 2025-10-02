import { Types } from "mongoose";
import { RatingDocument } from "../../models/ratingModel";
import { IBaseRepository } from "./IBaseRepository";
import { Sort } from "../../types/rating";

export interface IRatingRepository extends IBaseRepository<RatingDocument> {
    avgRatingOfMechanic(mechanicId: Types.ObjectId): Promise<any>
    avgRatingOfMechanics(mechanicId: Types.ObjectId[]): Promise<any>;
    pagenatedRatings(start: number, end: number, mechanicId: Types.ObjectId, sortBy: Sort): Promise<any>;

}