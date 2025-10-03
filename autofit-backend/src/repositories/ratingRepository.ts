import { Types } from "mongoose";
import { RatingDocument, RatingModel } from "../models/ratingModel";
import { BaseRepository } from "./baseRepository";
import { IRatingRepository } from "./interfaces/IRatingRepository";
import { Sort } from "../types/rating";

export class RatingRepository extends BaseRepository<RatingDocument> implements IRatingRepository {

    constructor() {
        super(RatingModel);
    }

    async avgRatingOfMechanic(mechanicId: Types.ObjectId): Promise<any> {
        return await RatingModel.aggregate([
            { $match: { mechanicId } },
            { $group: { _id: '$mechanicId', avg: { $avg: "$rating" }, reviews: { $sum: 1 } } }
        ])
    };

    async avgRatingOfMechanics(mechanicIds: Types.ObjectId[]): Promise<any> {

        return await RatingModel.aggregate([
            { $match: { mechanicId: { $in: mechanicIds } } },
            { $group: { _id: '$mechanicId', avg: { $avg: "$rating" }, reviews: { $sum: 1 } } }
        ])
    }

    async pagenatedRatings(start: number, end: number, mechanicId: Types.ObjectId, sortBy: Sort): Promise<any> {

        let sort = {}
        switch (sortBy) {
            case Sort.ALL:
                sort = {}
                break;
            case Sort.LEAST:
                sort = { rating: 1 }
                break;
            case Sort.TOP:
                sort = { rating: -1 }
                break;
        }

        const totalDocuments = await RatingModel.countDocuments({ mechanicId });
        const hasMore = totalDocuments > end

        const reviews = await RatingModel.find({ mechanicId }).sort(sort).skip(start).limit(end)
        .populate('userId', 'name -_id')
        .select('_id rating review createdAt');

        return {
            reviews,
            totalDocuments,
            hasMore
        }

    }



} 