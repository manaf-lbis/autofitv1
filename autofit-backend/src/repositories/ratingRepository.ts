import { RatingDocument, RatingModel } from "../models/ratingModel";
import { BaseRepository } from "./baseRepository";
import { IRatingRepository } from "./interfaces/IRatingRepository";

export class RatingRepository extends BaseRepository<RatingDocument> implements  IRatingRepository {

    constructor() {
        super(RatingModel);
    }

} 