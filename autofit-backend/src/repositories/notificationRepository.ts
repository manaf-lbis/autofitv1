import { Types } from "mongoose";
import { NotificationDocument, NotificationModel } from "../models/notification";
import { INotificationRepository } from "./interfaces/INotificationRepository";
import { BaseRepository } from "./baseRepository";

export class NotificationRepository extends BaseRepository<NotificationDocument> implements INotificationRepository {

  constructor() {
    super(NotificationModel);
  }

  async findAll(): Promise<NotificationDocument[]> {
    return await NotificationModel.find()
      .populate("recipientId requestId")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<NotificationDocument | null> {
    return await NotificationModel.findById(id).populate("recipientId requestId").exec();
  }

  async findByRecipientId(id: Types.ObjectId): Promise<NotificationDocument[]> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return NotificationModel.find({
      recipientId: id,
      $or: [
        { isRead: false },
        { createdAt: { $gte: threeDaysAgo } }
      ]
    })
      .sort({ createdAt: -1 })
      .select("isRead message _id createdAt")
      .lean();
  }
  
  async markAsRead(userId: Types.ObjectId): Promise<void> {
    await NotificationModel.updateMany({ recipientId: userId }, { isRead: true })
  }

}
