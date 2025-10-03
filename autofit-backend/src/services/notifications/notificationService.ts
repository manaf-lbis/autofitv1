import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { INotificationService, SentParam } from "./INotificationService";

export class NotificationService implements INotificationService {


    constructor(
        private _notificationRepository: INotificationRepository
    ) { }

    async getNotifications(userId:Types.ObjectId): Promise<any> {
        return await this._notificationRepository.findByRecipientId(userId)
    }


    async sendNotification(data: SentParam): Promise<any> {
        return await this._notificationRepository.save(data)
    }
    

    async updateNotificationStatus(userId:Types.ObjectId): Promise<any> {
        return await this._notificationRepository.markAsRead(userId)
    }



}