import { Types } from "mongoose";

export interface Notification {
    _id: Types.ObjectId;
    recipientId: Types.ObjectId; 
    recipientType: "user" | "mechanic"; 
    message: string; 
    isRead: boolean; 
    createdAt: Date;
    updatedAt: Date;
}
