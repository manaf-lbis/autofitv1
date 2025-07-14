import { Types } from "mongoose";
import { NotificationDocument } from "../../models/notification";
import { IBaseRepository } from "./IBaseRepository";

export interface INotificationRepository extends IBaseRepository<NotificationDocument> {
    findByRecipientId(id:Types.ObjectId):Promise<NotificationDocument[]>;
    markAsRead(userId:Types.ObjectId):Promise<void>;
}