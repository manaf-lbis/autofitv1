import { Types } from "mongoose";
import { NotificationDocument } from "../../models/notification";
import { IBaseRepository } from "./IBaseRepository";

export interface INotificationRepository extends IBaseRepository<NotificationDocument> {
    findByRecipientId(id:Types.ObjectId,start:number,end:number):Promise<{notifications:NotificationDocument[],hasMore:boolean,total:number}>;
    markAsRead(userId:Types.ObjectId):Promise<void>;
}