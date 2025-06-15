import { Types } from "mongoose";
import { NotificationDocument, NotificationModel } from "../models/notification";
import { INotificationRepository } from "./interfaces/INotificationRepository";

export class NotificationRepository implements INotificationRepository {

  async save(entity: NotificationDocument): Promise<NotificationDocument> {
    return await new NotificationModel(entity).save();
  }

  async findAll(): Promise<NotificationDocument[] | null> {
    return await NotificationModel.find()
      .populate("recipientId requestId")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<NotificationDocument | null> {
    return await NotificationModel.findById(id).populate("recipientId requestId").exec();
  }

  async update(id: Types.ObjectId, update: Partial<NotificationDocument>): Promise<NotificationDocument | null> {
    return await NotificationModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await NotificationModel.findByIdAndDelete(id).exec();
  }

  async create(entity: { recipientId: Types.ObjectId; recipientType: "user" | "mechanic"; message: string; }): Promise<NotificationDocument> {
    const notification = new NotificationModel(entity)
    return await notification.save()
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

