import { PretripFeatureDocument, PretripFeatureModel } from "../models/pretripPlanModel";
import { BaseRepository } from "./baseRepository";
import { IPretripFeatureRepository } from "./interfaces/IPretripFeatureRepository";

export class PretripFeatureRepository extends BaseRepository<PretripFeatureDocument> implements IPretripFeatureRepository {

    constructor() {
        super(PretripFeatureModel);
    }



}