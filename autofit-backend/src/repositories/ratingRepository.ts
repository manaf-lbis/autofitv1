import { Types } from "mongoose";
import { RatingDocument, RatingModel } from "../models/ratingModel";
import { BaseRepository } from "./baseRepository";
import { IRatingRepository } from "./interfaces/IRatingRepository";

export class RatingRepository extends BaseRepository<RatingDocument> implements IRatingRepository {

    constructor() {
        super(RatingModel);
    }

    async avgRatingOfMechanic(mechanicId: Types.ObjectId): Promise<any> {
        return await RatingModel.aggregate([
            { $match: { mechanicId } },
            { $group: { _id: null, avg: { $avg: "$rating" }, reviews: { $sum: 1 } } }
        ])
    };

    async avgRatingOfMechanics(mechanicIds: Types.ObjectId[]): Promise<any> {
        
        return await RatingModel.aggregate([
            {$match: { mechanicId: { $in: mechanicIds } } },
            { $group: { _id: '$mechanicId', avg: { $avg: "$rating" }, reviews: { $sum: 1 } } }
        ])
    }



} 