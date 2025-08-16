import { LiveAssistanceDocument, LiveAssistanceModel } from "../models/liveAssistanceModel";
import { BaseRepository } from "./baseRepository";
import { ILiveAssistanceRepository } from "./interfaces/ILiveAssistanceRepository";

export class LiveAsistanceRepository extends BaseRepository<LiveAssistanceDocument> implements ILiveAssistanceRepository {

    constructor (){
        super(LiveAssistanceModel);
    }

}