import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { INotificationService, SentParam } from "./INotificationService";
import { notifyUser } from "../../utils/notificationIO";

export class NotificationService implements INotificationService {


    constructor(
        private _notificationRepository: INotificationRepository
    ) { }

    async getNotifications(userId:Types.ObjectId, page: number): Promise<any> {

        const start = Number(page) <= 0 ? 0 : (page - 1) * Number(process.env.ITEMS_PER_PAGE);
        const end = start + Number(process.env.ITEMS_PER_PAGE); 
        
        return await this._notificationRepository.findByRecipientId(userId,start,end)
    }


    async sendNotification(data: SentParam): Promise<any> {
        const res = await this._notificationRepository.save(data)

        notifyUser(res.recipientId.toString(), {
            _id: res._id.toString(),
            message: res.message,
            createdAt: res.createdAt,
            isRead: res.isRead
        });

        return res
    }
    

    async updateNotificationStatus(userId:Types.ObjectId): Promise<any> {
        return await this._notificationRepository.markAsRead(userId)
    }



}