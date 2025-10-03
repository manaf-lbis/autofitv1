import { Types } from "mongoose"

export interface SentParam {
    recipientId: Types.ObjectId,
    recipientType: 'user' | 'mechanic',
    message: string
}

export interface INotificationService {
    getNotifications(userId: Types.ObjectId): Promise<any>
    sendNotification(data: SentParam): Promise<any>
    updateNotificationStatus(userId:Types.ObjectId): Promise<any>
}