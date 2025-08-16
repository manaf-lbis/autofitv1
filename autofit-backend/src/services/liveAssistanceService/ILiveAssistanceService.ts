import { Types } from "mongoose";

export interface ILiveAssistanceService {
    createBooking(concern: string, description: string, userId:Types.ObjectId): Promise<any>

}