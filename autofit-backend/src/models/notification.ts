import { Schema, model, Types, Document } from "mongoose";
import { Notification } from "../types/notification";

export interface NotificationDocument extends Notification, Document<Types.ObjectId> { }

const notificationSchema = new Schema<NotificationDocument>({
    recipientId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "recipientType"
    },
    recipientType: {
        type: String,
        enum: ["user", "mechanic"],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


notificationSchema.index({ recipientId: 1, recipientType: 1, createdAt: -1 });
notificationSchema.index({ requestId: 1 });


export const NotificationModel = model<NotificationDocument>("notification", notificationSchema);

